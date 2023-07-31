const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
      },
      {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
      },
      {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
      },
      {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
      }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let noteObject = new Blog(initialBlogs[0])
    await noteObject.save()
    noteObject = new Blog(initialBlogs[1])
    await noteObject.save()
})

test('notes are returned as json', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
},10000)

test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(2)
})

test('all notes have a unique identifier', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})
  
test('a valid note can be added ', async () => {
    const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "http://www.test.com",
        likes: 1
    }

    await api.post('/api/blogs').send(newBlog).expect(200).expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2 + 1)

    const contents = response.body.map(r => r.title)
    expect(contents).toContain('Test Blog')
})

test('likes property is not missing from the request', async () => {
    const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "http://www.test.com",
    }

    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body[2].likes).toEqual(0)
},10000)

test('title property is missing from the request', async () => {
    const newBlog = {
        author: "Test Author",
        url: "http://www.test.com",
        likes: 7
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
})

test('url property is missing from the request', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: "Test Author",
        likes: 7
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
})


afterAll(async () => {
  await mongoose.connection.close()
})