import mongoose, { Schema, Document } from 'mongoose'
import { IWriter } from './writer.js'
import { IArticle } from './article.js'


export interface IComment extends Document {
	_id: string
	content: string
	commenter: IWriter
	article: IArticle
	range: {
		index: number
		length: number
	}
	createdAt: Date
}

const CommentSchema: Schema = new Schema({
	content: {
		type: String,
		required: true
	},
	commenter: {
		type: Schema.Types.ObjectId,
		ref: 'writer',
		required: true
	},
	article: {
		type: Schema.Types.ObjectId,
		ref: 'article',
		required: true
	},
	range: {
		index: {
			type: Number,
			required: true
		},
		length: {
			type: Number,
			required: true
		}
	}
}, { timestamps: true })


export default mongoose.model<IComment>('comment', CommentSchema)
