import Article from '../models/article.js'
import Writer from '../models/writer.js'
import Comment from '../models/comment.js'

export const resolvers = {
	Query: {
		articles: async (parent: any, args: any) => {
			return await Article.find({$or: [{author: args.authorId}, {co_authors: args.authorId}] })
				.populate('author')
				.populate('co_authors')
				.populate({ path: 'comments', populate: { path: 'commenter' } })
				.exec();
		},
		co_articles: async (parent: any, args: any) => {
			return await Article.find({ co_authors: args.authorId })
				.populate('author')
				.populate('co_authors')
				.populate({ path: 'comments', populate: { path: 'commenter' } })
				.exec();
		}
		,
		author: async (parent: any, args: any) => {
			console.log('Fetching author with id: ', args.id)
			return await Writer.findOne({authorId: args.id})
		},
		article_comments: async (parent: any, args: any) => {
			console.log('Fetching article comments with id: ', args.id)
			return await Comment.find({articleId: args.id}).populate('commenter').exec()
		},
		article: async (parent: any, args: any) => {
			console.log('Fetching article with id: ', args.articleId)
			return await Article.findById(args.articleId).populate('author').populate('co_authors').populate({path: 'comments', populate: {path: 'commenter'}}).exec()
		}
	},
	Mutation: {
		del8Doc: async (parent: any, args: any) => {
			return await Article.findByIdAndDelete({articleId: args.id}, (err: Error) => {
				if (err) {
					console.log(err)
				}
				else {
					console.log('Document deleted successfully')
				}
			})
		},
		cr8Cmnt: async (parent: any, args: any) => {
      const comment = new Comment({
        content: args.content,
        commenter: args.commenter,
        article: args.article,
        range: args.range,
      });
      const cmnt = await comment.save();

      await Article.findByIdAndUpdate(args.article, { $push: { comments: cmnt._id } });

      return cmnt;
    },
		add_co_author: async (parent: any, args: any) => {
			console.log('Adding co-author with email: ', args.email, ' and articleId: ', args.articleId)
			const coAuthor = await Writer.findOne({ email: args.email})
			if (!coAuthor) {
				throw new Error('Co-author not found')
			}

			console.log('coAuthor: ',coAuthor)

			let article = await Article.findByIdAndUpdate(args.articleId, { $push: { co_authors: coAuthor._id } })

			if (!article) {
				throw new Error('Article not found')
			}

			return article
		}
	}
}
