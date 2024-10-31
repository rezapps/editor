import mongoose, { Schema, Document } from 'mongoose'
import { IArticle } from './article.js'

export interface IWriter {
	_id: string;
	email: string;
	password_hash: string;
	name: string;
	lastName: string;
	role: string;
	documents: IArticle[];
}

const WriterSchema: Schema = new Schema({
	name: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password_hash: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['author', 'co_author'],
		default: 'author'
	},
	documents: [{
		type: Schema.Types.ObjectId,
		ref: 'Document'
	}]
})

export default mongoose.model<IWriter>('writer', WriterSchema)
