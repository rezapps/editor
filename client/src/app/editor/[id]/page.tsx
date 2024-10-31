'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { io, Socket } from 'socket.io-client'
import { useParams } from 'next/navigation'
import Editor from '@/components/Editor'
import { useAuth } from '@/app/AuthContext'


interface Comment {
	content: string
	range: {
		index: number
		length: number
	}
	commenter: {
		_id: string
	}
	article: any
}

interface coAuthor {
	_id: string
	name: string
	lastName: string
	email: string
}

export default function EditorPage() {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [socket, setSocket] = useState<Socket<any, any> | null>(null)
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [newCmnt, setNewCmnt] = useState(null)
	const [cmnt, setCmnt] = useState<Comment[]>([])
	const [qtxt, setQtxt] = useState('')
	const [coAuthors, setCoAuthors] = useState<coAuthor[]>([])
	const params = useParams()
	const docid = params.id
	const { user } = useAuth()
	const [docAuthor, setDocAuthor] = useState()


	const baseApiUrl: string = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || ''


	useEffect(() => {
		const fetchDocument = async () => {
			if (!docid) {
				setIsLoading(false)
				return
			}

			try {
				const response = await fetch(`${baseApiUrl}/graphql`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query: `
							query Article($articleId: ID!) {
								article(articleId: $articleId) {
									title
									content
									author {
										name
										lastName
									}
									co_authors {
										name
										lastName
									}
									createdAt
									updatedAt
									comments {
										_id
										commenter {
											name
											lastName
										}
										content
										range
										createdAt				
									}
								}
							}
						`,
						variables: { articleId: docid },
					}),
				})
				if (!response.ok) {
					throw new Error('Failed to fetch document')
				}

				const d = await response.json()
				const data = d.data.article
				setTitle(data.title)
				setContent(data.content)
				setCmnt(data.comments)
				setCoAuthors(data.co_authors)
				setDocAuthor(data.author)
			} catch (err) {
				setError('Error fetching document. Please try again later.')
			} finally {
				setIsLoading(false)
			}
		}

		// websocket setup
		const setupSocket = () => {
			const newSocket: Socket<any, any> = io(baseApiUrl)
			setSocket(newSocket)
			return () => {
				newSocket.disconnect()
			}
		}

		fetchDocument()
		return setupSocket()
	}, [docid, baseApiUrl, user])


	const handlePrint = () => {
		const prntr = window.window.open('', '')

		if (prntr) {
			prntr.document.write(
				`
				<!DOCTYPE html>
				<head>
					<title>${title}</title>
					<style>
						img {
							display: block;
							max-width: 160mm;
							max-height: 220mm;
							width: auto;
							height: auto;
						}
						@page {
							margin: 1in;
							size: 210mm 297mm;
							padding: 24mm 16mm 16mm 16mm;
						}
						@media print {
							table {
								page-break-inside: avoid;
							}
							a[href]:after {
								content: " (" attr(href) ")";
								font-size: 90%;
								color: #333;
							}
						}
					</style>
				</head>
				<body onbeforeprint="self.history.pushState({}, '', './${title}')" onafterprint="self.close()">
					<main>
						<div>
							<h1>${title}<h1>
						</div>
						<article>${qtxt}</article>
					</main>
				</body>
				</html>
			`)
			prntr.print()
		}

		toast.success('Document printed successfully!', {
			position: 'top-right',
			autoClose: 1800,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		})
	}

	const handleCod = () => {
		setQtxt(content)
	}

	const handleSave = async () => {
		socket?.emit('update_doc', { 'content': content, 'title': title, 'docId': docid })

		toast.success('Document saved successfully!', {
			position: 'top-right',
			autoClose: 1800,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		})
	}

	const emitChanges = useCallback((delta: any) => {
		socket?.emit('send_changes', delta)
	}, [socket])

	const handleAddAuthor = async () => {
		const prompt = window.prompt('Enter author email:')

		if (prompt) {
			const res = await fetch(`${baseApiUrl}/graphql`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: `
						mutation add_co_author($articleId: ID!, $email: String!) {
							add_co_author( articleId: $articleId, email: $email ) {
								_id
								co_authors {
									_id
									name
									lastName
									email
								}
							}
						}
					`,
					variables: {
						articleId: docid,
						email: prompt
					}
				})
			})

			if (!res.ok) {
				throw new Error('Failed to add author')
			}

			const data = await res.json()

			setCoAuthors([...coAuthors, data.data.add_co_author])
		}

	}

	const handleIncomingChanges = useCallback((handler: (txts: any) => void) => {
		socket?.on('get_changes', handler)

		return () => {
			socket?.off('get_changes', handler)
		}
	}, [socket])

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">Loading...</div>
	}

	if (error) {
		return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
	}

	if (newCmnt !== null) {
		handleSave()
		const newComment = {
			content: (newCmnt as Comment).content,
			commenter: user?.id,
			article: docid,
			range: (newCmnt as Comment).range
		}

		if (socket) {
			socket.emit('send_new_comment', newComment)
			setNewCmnt(null)
		}

	}

	socket?.on('get_new_comment', (newComment: any) => {
		setCmnt([...cmnt, newComment])
	})
	
	return (
		<div>
			<div className='ttl-field mb-1'>
				<input
					type="text"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Enter document title"
				/>
				<div className='cstomBtn'>
					<button className='addbtn' onClick={handleAddAuthor}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<g transform="translate(1,1)">
								<path
									d="M 11 3 C 9.338 3 8 4.338 8 6 C 8 7.662 9.338 9 11 9 C 12.662 9 14 7.662 14 6 C 14 4.338 12.662 3 11 3 z M 11 11 C 8.23 11 6 11.89198 6 13 L 6 18 L 6 19 L 7.2011719 19 L 13 19 L 13 18 L 7 18 L 7 13.427734 C 7 12.636304 8.784 12 11 12 C 12.795116 12 14.289377 12.420682 14.798828 13 L 16 13 C 16 11.89198 13.77 11 11 11 z M 16 14 L 16 16 L 14 16 L 14 17 L 16 17 L 16 19 L 17 19 L 17 17 L 19 17 L 19 16 L 17 16 L 17 14 L 16 14 z "/>
							</g>
						</svg>
					</button>
					<button className="codbtn" onClick={handleCod}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<g transform="translate(1,1)">
								<path
									d="m10.04492 3c-1.77683 0-2.521484.706446-2.521484 2.509766v2.441406c0 1.11382-.034195 2.404297-1.015625 2.404297h-.507813v1.289062h.507813c.98148 0 1.015625 1.290477 1.015625 2.404297v2.441406c0 1.80332.744654 2.509766 2.521484 2.509766v-1.183594c-1.18455 0-1.201172-.478327-1.201172-2.210937v-2.01563c0-.83093-.204705-2.067378-1.203125-2.580078.99842-.51271 1.203125-1.751092 1.203125-2.582032v-2.033203c0-1.7326.016592-2.210937 1.201172-2.210937v-1.183594m1.894531 0v1.183594c1.18456 0 1.216797.478337 1.216797 2.210937v2.033203c0 .83094.204705 2.069322 1.203125 2.582032-.99842.5127-1.203125 1.749148-1.203125 2.580078v2.01563c0 1.73261-.032187 2.210937-1.216797 2.210937v1.183594c1.77684 0 2.537109-.706446 2.537109-2.509766v-2.441406c0-1.11382.068644-2.404297 1.033204-2.404297h.490234v-1.289062h-.490234c-.96457 0-1.033204-1.290477-1.033204-2.404297v-2.441406c0-1.80332-.760269-2.509766-2.537109-2.509766"/>
							</g>
						</svg>
					</button>
					<button className="prnt" onClick={handlePrint}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<g transform="translate(1,1)">
								<path
									d="m 5,3 v 1 4 c 0,0 -2,0 -2,2 0,2 0,2 0,4 0,2 2,2 2,2 h 2 v 2 1 h 8 v -1 -2 h 2 c 0,0 2,0 2,-2 0,-2 0,-2 0,-4 C 19,8 17,8 17,8 V 4 3 Z M 6,4 H 16 V 8 H 15 V 7 H 7 V 8 H 6 Z m 1,1 v 1 h 8 V 5 Z M 5,9 h 12 c 0,0 1,0 1,1 0,1 0,3 0,4 0,1 -1,1 -1,1 H 16 V 13 H 6 v 2 H 5 C 5,15 4,15 4,14 4,13 4,11 4,10 4,9 5,9 5,9 Z m 9,1 v 1 h 3 v -1 z m -6,6 h 6 v 2 H 8 Z"/>
							</g>
						</svg>
					</button>
					<button className="savebtn" onClick={handleSave}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
							<g transform="translate(1,1)">
								<path
									d="M 8.858847,2.9980469 6,3 c 0,0 -3,0 -3,3 0,3 0,7 0,10 0,3 3,3 3,3 h 10 c 0,0 3,0 3,-3 0,-3 0,-9 0,-9 V 6.3007812 h -0.0078 L 19,6.2910156 15.707031,2.9980469 l -0.0078,0.00977 v -0.00977 H 15 Z M 6,4 h 1 v 4 1 h 8 V 8 4 h 0.292969 L 18,6.7070312 V 7 c 0,0 0,7 0,9 0,2 -2,2 -2,2 V 11 H 15 7 6 v 7 C 6,18 4,18 4,16 4,14 4,8 4,6 4,4 6,4 6,4 Z m 2,0 h 3.900391 V 8 H 8 Z m -1,8 h 8 v 6 H 7 Z"/>
							</g>
						</svg>
					</button>
				</div>
			</div>
			{typeof window !== 'undefined'}
			<Editor
				docid={docid}
				content={content}
				setContent={setContent}
				setQtxt={setQtxt}
				setNewCmnt={setNewCmnt}
				emitChanges={emitChanges}
				handleIncomingChanges={handleIncomingChanges}
				cmnt={cmnt}
				coAuthors={coAuthors}
				docAuthor={docAuthor}
			/>
		</div>
	)
}

