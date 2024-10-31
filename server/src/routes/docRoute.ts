import express from 'express'
import { Server, Socket } from 'socket.io'
import Docmnt from '../models/article.js'
import Comment from '../models/comment.js'


import { getDox, getDoc, cr8Doc, del8Doc } from '../controllers/docController.js'

const router = express.Router()

// Get All Docs
router.get('/docs/:userid', getDox)

// Delete a Doc
router.delete('/doc/delete/:id', del8Doc)

// Get one Doc
router.get('/doc/:id', getDoc)

// Post a new Doc
router.post('/doc/new', cr8Doc)

router.use((req, res) => {
	res.status(404).send('404: Page Not Found');
})

// Patch doc is handled by websocket
export const soket = (io: Server) => {
	io.on('connection', (socket: Socket) => {
		socket.on('join_doc', async (docId: string) => {
			socket.join(docId)
		})

		socket.on('leave_doc', (docId: string) => {
			socket.leave(docId)
		})

		socket.on('update_doc', async (data: { docId: string; content: any; title: string }) => {
			try {
				const { docId, content, title } = data
				const updatedDoc = await Docmnt.findByIdAndUpdate(docId, { content, title }, { new: true })
				if (updatedDoc) {
					io.to(docId).emit('doc_updated', { docId, content: updatedDoc.content, title: updatedDoc.title })
				}
			} catch (error) {
				console.error('Error updating document:', error)
			}
		})

		socket.on('send_changes', delta => {
			socket.broadcast.emit('get_changes', delta)
		})

		socket.on('send_new_comment', async (data: {
			content: string;
			article: string;
			commenter: string;
			range: { index: number; length: number };
		}) => {
			try {
				if (!data.content || !data.article || !data.commenter) {
					throw new Error('Missing required fields in the comment data.')
				}
				const newComment = new Comment({
					content: data.content,
					article: data.article,
					commenter: data.commenter,
					range: data.range
				})

				const savedComment = await newComment.save()
				savedComment.populate('commenter')
				
				await Docmnt.findByIdAndUpdate(data.article, { $push: { comments: savedComment._id } })
				
				socket.emit('get_new_comment', savedComment)
				socket.broadcast.emit('get_new_comment', savedComment)
			} catch (error: Error | any) {
				socket.emit('error_saving_comment', { error: error.message })
			}
		})

		socket.on('disconnect', () => {
			// console.log(`user ${socket.id} disconnected`)
		})
	})
}

export default router
