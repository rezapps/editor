import { Request, Response } from 'express'
import Article from '../models/article.js'
import Writer from '../models/writer.js'


export const getDox = async (req: Request, res: Response) => {
	try {
		const userid = req.params.userid
		console.log('fetching documents for user with id: ', userid)

		if (!userid) {
			return res.status(400).json({ message: 'User userid is required' })
		}

		const dox = await Article.find({ author: userid }).populate('co_authors').populate('author').exec()

		if (!dox) {
			return res.status(404).json({ message: 'No documents found for this author' })
		}

		res.json(dox)
	} catch (error: Error | any) {
		console.error('Error fetching documents:', error.message)
		res.status(500).json({ message: 'Error fetching documents', error: error.message })
	}
}


export const getDoc = async (req: Request, res: Response) => {
	const docid = req.params.id
	console.log('fetching document with id: ', docid)

	try {
		const doc = await Article.findOne({ _id: docid })

		if (!doc) {
			return res.status(404).json({ message: 'Document not found' })
		}

		if (doc instanceof Error) {
			console.error('Error retrieving document:', doc.message)
			return res.status(500).json({ message: 'Error fetching document' })
		}

		res.json(doc)
	} catch (error: Error | any) {
		console.error('Unexpected error:', error.message)
		return res.status(500).json({ message: 'Error fetching document' })
	}
}

export const cr8Doc = async (req: Request, res: Response) => {
	try {
		const { title, content, authorId } = req.body

		if (!title || !content || !authorId) {
			return res.status(400).json({ message: 'Missing required fields: title, content, or authorId' })
		}

		const newArticle = new Article({
			title,
			content,
			author: authorId,
		})

		await newArticle.save()

		const updatedUser = await Writer.findByIdAndUpdate(authorId, { $push: { documents: newArticle._id } }, { new: true })

		if (!updatedUser) {
			return res.status(404).json({ message: 'Author not found' })
		}

		res.status(201).json(newArticle)
	} catch (error: Error | any) {
		console.error('Error creating document:', error)
		res.status(500).json({ message: 'Error creating document', error: error.message })
	}
}

export const del8Doc = async (req: Request, res: Response) => {
	const docid = req.params.id

	try {
		const doc = await Article.findById(docid)

		if (!doc) {
			return res.status(404).json({ message: 'Document not found' })
		}

		await Article.findByIdAndDelete(docid)

		await Writer.updateMany(
			{ documents: docid },
			{ $pull: { documents: docid } }
		)

		res.json({ message: `Document with id ${docid} deleted successfully` })
	} catch (error: Error | any) {
		console.error('Error deleting document:', error)
		res.status(500).json({ message: 'Error deleting document', error })
	}
}

const addCoAuthor = async (req: Request, res: Response) => {
	try {
		const { docId, coAuthorId } = req.body
		const doc = await Article.findById(docId)
		const coAuthor = await Writer.findById(coAuthorId)

		if (!doc || !coAuthor) {
			return res.status(404).json({ message: 'Document or user not found' })
		}

		if (doc.co_authors.includes(coAuthorId)) {
			return res.status(400).json({ message: 'User is already a co-author' })
		}

		doc.co_authors.push(coAuthorId)
		await doc.save()

		coAuthor.documents.push(docId)
		await coAuthor.save()

		res.json({ message: 'Co-author added successfully' })
	} catch (error: Error | any) {
		console.error('Error adding co-author:', error)
		res.status(500).json({ message: 'Error adding co-author', error })
	}
}
