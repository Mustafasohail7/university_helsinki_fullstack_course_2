const middleware = require('../utils/middleware')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  console.log(authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })

blogRouter.post('/', middleware.userExtractor , async (request, response, next) => {
  const body = request.body
  const user = await User.findById(request.user.id)

  if(body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const note = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const blog = await note.save()
  await blog.populate('user')
  user.notes = user.notes.concat(blog.id)
  await user.save()
  response.status(201).json(blog)
})

blogRouter.delete('/:id', middleware.userExtractor ,async (request, response, next) => {
  const blogOwner = await Blog.findById(request.params.id)
  if(blogOwner.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized user' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const blog = await Blog.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(blog)
})

module.exports = blogRouter