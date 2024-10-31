import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'
import { Server } from 'socket.io'
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import docRoute, { soket } from './routes/docRoute.js'
import userRoute from './routes/userRoute.js'
import typeDefs from './graphql/schema.js'
import { resolvers } from './graphql/resolver.js'


const PORT = process.env.PORT || 5000
const app = express()

const httpServer = http.createServer(app)

const server = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
})

app.use(cors({
	origin: '*',
	methods: ['GET', 'POST']
}))
app.use(express.json())
app.use('/api', docRoute)
app.use('/auth', userRoute)

mongoose.connect(process.env.MONGODB_URI as string)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('MongoDB connection error:', err))

soket(io)

app.use(
	'/graphql',
	expressMiddleware(server, {
		context: async ({ req }) => ({ token: req.headers.token }),
	})
)

new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
