import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'
import BlogForm from './components/blogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [type,setType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setType(1)
      setErrorMessage('Logged in')
      setTimeout(() => {
        setErrorMessage(null)
        setType(null)
      },5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setType(0)
      setTimeout(() => {
        setErrorMessage(null)
        setType(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )

  const addBlog = async (object) => {
    blogFormRef.current.toggleVisibility()

    try{
      const result = await blogService.create(object)  
      setBlogs(blogs.concat(result))
      setErrorMessage(`a new blog ${object.title} by ${object.author} added`)
      setType(1)
      setTimeout(() => {
        setErrorMessage(null)
        setType(null)
      },5000)
    } catch (exception) {
      setErrorMessage('Invalid blog')
      setType(0)
      setTimeout(() => {
        setErrorMessage(null)
        setType(null)
      }, 5000)
    }
  }
  
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  console.log(blogs)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={type} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} is logged in<button onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm  addBlog={addBlog} />
        </Togglable>
        </div>}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App