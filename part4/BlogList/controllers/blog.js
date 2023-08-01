const config = require('../utils/config')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
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

blogRouter.post('/', async (request, response, next) => {
  console.log(request.body)
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request),config.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

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
  user.notes = user.notes.concat(blog.id)
  await user.save()
  response.status(201).json(blog)
})

blogRouter.delete('/:id', async (request, response, next) => {
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