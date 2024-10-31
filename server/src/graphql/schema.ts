import { gql } from 'graphql-tag'

const typeDefs = gql`
  # GraphQL schema definition
	scalar JSON
	scalar Date

  type Author {
    _id: ID!
    name: String
    lastName: String
    email: String
    password_hash: String!
    articles: [Article]
		comments: [Comment]
  }

	type Comment {
		_id: ID!
		content: String
		commenter: Author!
		range: JSON
		article: Article!
		createdAt: Date
	}

  type Article {
		_id: ID!
		title: String
		content: JSON
		author: Author!
		co_authors: [Author!]
		comments: [Comment!]
		createdAt: Date
		updatedAt: Date
  }

  type Query {
    articles(authorId: ID!): [Article!]!
		co_articles(authorId: ID!): [Article!]!
		author(authorId: ID!): Author!
		article_comments(articleId: ID!): [Comment!]
		article(articleId: ID!): Article
  }

	type Mutation {
		cr8Doc(authorId: ID!, title: String!, content: JSON!): Article
		upd8Doc(articleId: ID!, title: String, content: JSON): Article
		del8Doc(articleId: ID!): Article

		cr8Cmnt(article: ID!, content: String!, commenter: ID!, range: JSON!): Comment

		del8Comment(commentId: ID!): Comment

		cr8User(name: String!, lastName: String!, email: String!, password: String!): Author
		upd8User(authorId: ID!, name: String, lastName: String, email: String, password: String): Author
		del8User(authorId: ID!): Author
		add_co_author(articleId: ID!, email: String!): Article
	}
`

export default typeDefs
