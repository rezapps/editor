import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { getDox, getDoc, cr8Doc, del8Doc } from '../controllers/docController'
import * as dbHandler from './setup'
import Docmnt from '../models/article'
import User from '../models/writer'



const app = express()
app.use(express.json())

beforeAll(async () => await dbHandler.connect())

afterEach(async () => await dbHandler.clearDatabase())

afterAll(async () => await dbHandler.closeDatabase())

// Mock routes
app.get('/api/docs/:userid', getDox)
app.get('/api/doc/:id', getDoc)
app.post('/api/doc/new', cr8Doc)
// app.patch('/api/doc/:id', upd8Doc)
app.delete('/api/doc/:id', del8Doc)

describe('Document Controller', () => {
    let userId: any
    let docId: any

    beforeEach(async () => {
        const user = new User({ name: 'testuser', email: 'test@example.com', lastName: 'lastname', password_hash: '$2b$10$RWZewoF1gnhirWSctFbXzewCR8bLsfyy1W6aek0JVErJmgAIA.ZCS' })
        await user.save()
        userId = user._id

        const doc = new Docmnt({
            title: 'Test Doc',
            content: 'Test Content',
            author: userId,
            version: 1,
        })
        await doc.save()
        docId = doc._id

    })

    it('should create a new document', async () => {
        const newTitle = 'New Doc'
        const newContent = 'New Content'

        const res = await request(app)
            .post('/api/doc/new')
            .send({ _id: docId, title: newTitle, content: newContent, authorId: userId })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('_id')
        expect(res.body.title).toBe(newTitle)
        expect(res.body.content).toBe(newContent)
        expect(res.body.author).toBe(userId.toString())
    })

    it('should get all documents for a user', async () => {
        const res = await request(app).get(`/api/docs/${userId}`)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toBe(1)
        expect(res.body[0].title).toBe('Test Doc')
    })

    it('should get a single document', async () => {
        const res = await request(app).get(`/api/doc/${docId}`)

        expect(res.status).toBe(200)
        expect(res.body._id).toBe(docId.toString())
        expect(res.body.title).toBe('Test Doc')
    })

    // it('should update a document', async () => {
    //     const updatedTitle = 'Updated Doc'
    //     const updatedContent = 'Updated Content'

    //     const res = await request(app)
    //         .patch(`/api/doc/${docId}`)
    //         .send({ title: updatedTitle, content: updatedContent })

    //     expect(res.status).toBe(200)
    //     expect(res.body.title).toBe(updatedTitle)
    //     expect(res.body.content).toBe(updatedContent)
    //     expect(res.body.version).toBe(1.1)
    // })

    it('should delete a document', async () => {
        const res = await request(app).delete(`/api/doc/${docId}`)

        expect(res.status).toBe(200)
        expect(res.body.message).toBe(`Document with id ${docId} deleted successfully`)

        const deletedDoc = await Docmnt.findById(docId)
        expect(deletedDoc).toBeNull()
    })
})
