import mongoose, { Schema, Document } from 'mongoose'
import {IWriter} from './writer.js'
import {IComment} from './comment.js'


export interface IArticle extends Document {
	title: string
	content: string
	author: IWriter
	co_authors: IWriter[]
	comments: IComment[]
	createdAt: Date
	updatedAt: Date
	version: number
}

const ArticleSchema: Schema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: Object,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'writer',
		required: true
	},
	co_authors: [{
		type: Schema.Types.ObjectId,
		ref: 'writer'
	}],
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'comment'
	}]
}, { timestamps: true })


export default mongoose.model<IArticle>('article', ArticleSchema)
