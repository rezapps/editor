'use client'

import React from 'react'

interface Comment {
	_id: string
	commenter: {
		name: string
		lastName: string
	}
	content: string
	range: {
		index: number
		length: number
	}
	createdAt: string
}

interface coAuthor {
	_id: string
	name: string
	lastName: string
	email: string
}

interface CommentsProps {
	cmnt: Comment[]
	hilite: any
	coAuthors: coAuthor[]
	docAuthor: coAuthor
}

const Comments: React.FC<CommentsProps> = ({ cmnt, hilite, coAuthors, docAuthor }) => {
	return (
		<div>
			<h3 className='text-center py-2 bg-white'>Authors and Comments</h3>
			<hr />
			<div className="cmnto h-[100%] overflow-y-auto">
				<div key="authors" className='ml-1 mr-2 mt-2 px-3 py-4 bg-white'>
					<p><span>Author: </span> {docAuthor.name} {docAuthor.lastName}</p>
					{coAuthors?.map((writer: coAuthor) => (
						<div key={writer._id} className="mb-4">
							<div className="flex items-center mb-2">
								<span className="font-semibold">coAuthor: {writer.name} {writer.lastName}</span>
							</div>
						</div>
					))}
				</div>
				<div className='ml-1 mr-2 h-[99%] mt-2 px-1.5 pt-4 bg-white'>
					{cmnt?.map((c) => (
						<div key={c._id} className="mb-4">
							<div className="flex items-center mb-2">
								<span className="font-semibold">{c.commenter.name} {c.commenter.lastName}</span>
							</div>
							<a href="#" onClick={hilite}><p className="text-gray-700" data-index={c.range.index} data-length={c.range.length}>{c.content}</p></a>
							<p className="text-gray-400 text-sm">{new Intl.DateTimeFormat('en-GB', {timeStyle: 'short', dateStyle: 'medium'}).format(new Date(c.createdAt))}</p>
							<hr className="my-2" />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Comments
