'use client'

import { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { Delta } from 'quill/core'
import Comments from '@/components/Comment'
import 'quill/dist/quill.snow.css'
import './editor.css'

interface EditorProps {
	docid: any
	content: any
	setContent: (content: any) => void
	setNewCmnt: (setNewCmnt: any) => void
	setQtxt: (qtxt: string) => void
	emitChanges: (delta: Delta) => void
	handleIncomingChanges: (handler: (txts: any) => void) => (() => void) | undefined
	cmnt: any
	coAuthors: any
	docAuthor: any
}

const toolbarOptions = [
	[{ 'header': [1, 2, 3, 4, false] }],
	['bold', 'italic', 'underline', 'strike'],
	['link', 'image', 'video', 'formula'],
	[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
	[{ 'indent': '-1' }, { 'indent': '+1' }],
	[{ 'color': [] }, { 'background': [] }],
	['blockquote', 'code-block'],
	['clean'],
	['cmntBtn']
]

const Editor = ({ content, setContent, setQtxt, setNewCmnt, emitChanges, handleIncomingChanges, cmnt, coAuthors, docAuthor }: EditorProps) => {
	const editorRef = useRef<HTMLDivElement | null>(null)
	const [quill, setQuill] = useState<Quill | null>(null)

	useEffect(() => {
		if (typeof window !== 'undefined' && editorRef.current && !quill) {
			const quil = new Quill(editorRef.current, {
				theme: 'snow',
				modules: {
					toolbar: toolbarOptions,
				}
			})

			if (quil.getLength() <= 1) {
				quil.updateContents(content)
				setQtxt(quil.root.innerHTML)
			}

			quil.on('selection-change', (range) => {
				if (range) {
					quil.scrollSelectionIntoView()
				}
			})

			setQuill(quil)

			const cmntBtn = document.querySelector('.ql-cmntBtn')

			if (cmntBtn) {
				cmntBtn.innerHTML = `
				<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 540" width="24" height="24"><path fill-rule="evenodd" d="m467 11.7c3.6 0.2 9.8 1.6 13.8 2.9 3.9 1.3 10 3.8 13.4 5.5 3.5 1.7 9.3 5.1 13 7.5 3.8 2.4 8.9 6.5 11.4 9.2 2.5 2.6 6.2 8.1 8.2 12.1 3.7 7.4 3.7 7.6 3.7 20 0 10.4-0.4 13.9-2.3 20.1-1.3 4.1-7.3 18.3-13.4 31.5-6.1 13.2-11.8 26.3-12.8 29-1 2.8-2.5 6.6-5.3 12l3.8 6.5c2.1 3.6 6.9 11.4 10.6 17.5 3.7 6.1 8.6 14.8 10.8 19.5 2.2 4.7 6 14.6 8.5 22 3.2 9.4 4.9 16.6 5.7 23.5 0.6 6.2 0.9 22.9 0.6 44-0.4 32.7-0.5 34.4-3 44-1.4 5.5-4.5 15.6-6.7 22.5-2.3 6.9-6.3 16.6-8.9 21.5-2.5 4.9-8.7 15.1-13.6 22.5-7.2 11-11.4 16-22.4 26.9-7.5 7.4-16.7 15.8-20.6 18.7-3.9 2.8-12.2 8.1-18.5 11.7-6.3 3.5-14.6 8-18.5 9.9-3.9 2-11.1 4.9-16 6.6-4.9 1.7-13.5 4.3-19 5.7-5.5 1.4-13.8 3-18.5 3.5-4.7 0.5-52.6 1.1-204.5 2l-11.5 5.6c-6.3 3.1-18.7 9.4-27.5 14.1-8.8 4.7-19.8 10.1-24.5 12-6.1 2.5-10.7 3.7-16 4.1-5.6 0.4-8.7 0.1-12.3-1.1-3-1.1-5.9-3.1-7.9-5.6-1.8-2.1-3.9-5.6-4.7-7.7-1.1-3-1.5-12.1-2.2-73.9l-3.8-4c-2.1-2.2-7.6-8.9-12.4-15-4.7-6.1-11.1-15.1-14.2-20-3.1-4.9-8.1-13.9-11-20-2.9-6.1-6.5-14.6-7.9-19-1.5-4.4-3.8-12.3-5.1-17.5-1.3-5.2-2.8-12.8-3.4-16.7-0.6-4-1.1-14.4-1.1-23 0.1-8.7 0.5-24.6 0.9-35.3 0.7-14.6 1.4-21.6 3.1-28 1.2-4.7 4.2-14.1 6.7-21 2.5-6.9 6-15.4 7.8-19 1.8-3.6 7.8-13.2 13.3-21.5 5.5-8.2 12.8-18.1 16.3-21.9 3.5-3.8 12-11.9 18.9-17.9 6.9-6.1 15.9-13.2 20-15.9 4.1-2.7 13.1-7.8 20-11.3 6.9-3.4 16.5-7.7 21.5-9.4 4.9-1.8 13.3-4.3 18.5-5.6 5.2-1.4 13.3-2.9 18-3.4 4.7-0.6 43.8-1.2 87-1.6 43.2-0.3 92.9-0.8 142.5-1.7l3-5.9c1.6-3.3 8-16 14.2-28.2 9-18 12.3-23.4 17-28.6 4.2-4.6 7.7-7.2 12.8-9.7 3.9-1.9 9.5-3.8 12.5-4.3 3-0.5 8.4-0.7 12-0.4zm-39.8 96.9c-1.8 2.1-6.8 10.9-11.1 19.4-4.3 8.5-14.4 29-22.4 45.5-8 16.5-19.1 40.1-24.7 52.5-5.6 12.4-11.3 25.8-12.6 29.7-1.3 4-2.4 8.3-2.4 9.5 0 1.3 0.5 4 1 6 0.6 2.1 2.7 5.6 4.7 7.9 2.1 2.2 6.5 5.4 9.8 7 4.2 2 7.6 2.8 11.2 2.9 3 0 6.9-0.8 9-1.8 2-0.9 5-3.3 6.6-5.2 1.6-1.9 7.9-13.6 13.9-26 6.1-12.4 20.1-41.4 31.3-64.5 11.1-23.1 21.8-46.1 23.8-51 2-4.9 3.9-10.8 4.2-13 0.4-2.2 0.2-5.9-0.4-8.3-0.6-2.3-2.8-6-4.9-8.4-2-2.2-6.4-5.4-9.7-7-4.4-2-7.5-2.8-11.5-2.8-3.3 0.1-6.9 0.8-9 1.9-1.9 1-5 3.6-6.8 5.7zm-253.2 28.9c-3.6 0.8-11.9 3-18.5 5-6.6 2-14.7 4.9-18 6.5-3.3 1.6-8.9 5-12.5 7.6-3.6 2.6-10.3 6.8-15 9.3-4.8 2.6-11.4 7.4-15.4 11.1-3.8 3.6-10.3 10.8-14.6 16-4.2 5.2-9.6 12.4-12 16-2.4 3.6-6.3 10.6-8.6 15.5-2.4 4.9-5.7 13.3-7.4 18.5-1.7 5.2-3.8 13.6-4.6 18.5-1.3 7-1.5 14.1-1.2 31.5 0.5 21.4 0.6 23.1 3.7 34.5 2.1 7.9 5.3 16.5 9.4 25 3.5 7.1 8.5 16.4 11.1 20.5 2.7 4.1 6.9 10 9.5 13 2.5 3 7.5 8.7 11.1 12.6 3.6 3.9 7.7 9.6 9.2 12.5 1.4 3 3.1 8.3 3.7 11.9 0.6 3.6 1.1 9.8 1.1 13.8 0 3.9 0.6 9.3 1.2 11.9 0.8 2.7 2.4 5.6 4 7 2.1 1.7 4 2.3 7.5 2.3 3.3 0 7.3-1.1 12.8-3.6 4.4-2 11.4-4.8 15.5-6.2l7.5-2.7 214-1.1c19.4-5 28.6-7.6 33-9.1 4.4-1.4 11.4-4.3 15.5-6.3 4.1-2.1 10.8-6.1 14.7-8.9 4-2.8 10.5-8.4 14.4-12.4 4-3.9 9.1-9.9 11.4-13.2 2.4-3.3 8.2-12.8 12.9-21 4.8-8.3 10-18.6 11.7-23 1.7-4.4 4.6-13.6 6.5-20.5 1.9-6.9 3.9-16.6 4.5-21.5 0.6-6.1 0.6-15.2 0-28-0.8-14-1.7-21.5-3.4-28.5-1.3-5.2-3.7-12.4-5.3-15.9-1.6-3.5-4.1-7.5-5.6-8.8-1.5-1.2-3.7-2.3-4.8-2.3-1.1 0-3.4 0.7-5 1.5-1.6 0.8-4.4 3.6-6.2 6.3-1.8 2.6-12.1 22.9-23.1 45.2-10.9 22.3-21.8 43.4-24.2 47-2.4 3.6-10.3 12.4-17.7 19.5-7.3 7.1-19.2 18.4-26.3 25-7.2 6.7-15 13.5-17.5 15.2-2.5 1.7-7 3.9-10 4.9-5.2 1.8-10.3 1.9-95.5 1.9-60.6 0-94.9-0.4-105-1.2-8.3-0.7-16.7-1.7-18.8-2.3-2-0.5-5.3-2.5-7.3-4.3-2-1.7-4.3-4.4-5-6-0.8-1.5-1.4-5.2-1.4-8.2 0-3.4 0.7-6.9 1.9-9.3 1-2 3-4.7 4.3-5.9 1.2-1.2 4.5-3.2 7.3-4.5l5-2.3c142.8-1.1 162.2-1.5 166.5-2.6 3.6-0.8 6.6-2.4 8.5-4.4 2-1.9 3.6-4.9 4.4-8.5 0.8-3.3 1.2-8.5 0.9-13-0.3-4.9-1.2-8.9-2.6-11.8-1.5-2.8-3.6-4.9-6.5-6.5l-4.2-2.2-189-1c-9-4.5-10.5-6-12.5-10-2-4.1-2.4-6.5-2.4-13.5 0-7 0.4-9.4 2.4-13.5 2-4 3.5-5.5 7.5-7.5l5-2.5c203.6-1 204-1 208-3.1 2.2-1.2 5.5-3.8 7.2-5.8 1.9-2.1 3.6-5.2 3.9-7.4 0.4-2.5 0.1-4.8-1-7-0.9-1.7-3.1-4-4.9-5-3-1.6-10-1.7-93.7-2.2l-90.5-0.5c-9-4.5-10.5-6-12.5-10-2.2-4.5-2.5-6.2-2.4-16 0-9.1 0.4-11.8 2.2-15.8 1.2-2.6 3.4-5.5 4.9-6.5 2.5-1.6 10.1-1.7 111.8-2.2l109-0.5c6.2-3.3 9.4-5.8 11-7.5 1.7-1.9 3.5-5.2 4.1-7.9 0.6-2.5 0.8-5.9 0.5-7.6-0.3-1.7-1.7-4.1-3.1-5.5-1.4-1.4-4.7-3.1-7.3-3.8-3.6-0.9-23.9-1.2-86.5-1.1-44.9 0.1-82.8 0.4-84.2 0.6-1.4 0.2-5.4 1-9 1.8z"/></svg>
				`

				cmntBtn.addEventListener('click', () => {
					const rng = quil.getSelection()

					if (!rng) {
						alert('Please select (highlight) the text or line you want to comment')
					} else if (rng && rng.length > 0) {
						const prompt = window.prompt('Enter comment')

						if (prompt == null || prompt === '') {
							return
						} else if (prompt) {
								quil.formatText(rng.index, rng.length, {
									cssClass: 'comment',
									format: 'user',
									value: prompt
								})

								setNewCmnt({
									content: prompt,
									range: rng
								})
							}
						}
				})
			}

		}
	}, [quill, setNewCmnt, setQtxt, content])

	useEffect(() => {
		if (quill == null) return

		const handler = (delta: Delta, oldDelta: Delta, source: string) => {
			if (source !== 'user') return

			emitChanges(delta)
			setContent(quill.getContents())
			setQtxt(quill.root.innerHTML)
		}

		quill.on('text-change', handler)

		return () => {
			quill.off('text-change', handler)
		}
	}, [quill, emitChanges, setContent, setQtxt])

	useEffect(() => {
		if (quill == null) return

		return handleIncomingChanges((txts: any) => {
			quill.updateContents(txts)
		})
	}, [quill, handleIncomingChanges])

	const hilite = (e: any) => {
		e.preventDefault()
		const index = parseInt(e.target.getAttribute('data-index'))
		const length = parseInt(e.target.getAttribute('data-length'))

		if (!quill) return
		quill.setSelection(index, length)
		quill.scrollSelectionIntoView()
	}

	return (
		<div className='w-full flex flex-row gap-1 editComment'>
			<div>
				<div ref={editorRef} />
			</div>
			<Comments cmnt={cmnt} hilite={hilite} docAuthor={docAuthor} coAuthors={coAuthors}/>
		</div>
	)
}

export default Editor
