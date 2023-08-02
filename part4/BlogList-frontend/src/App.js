import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url,setUrl] = useState('')
  const [likes,setLikes] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [type,setType] = useState(null)

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

  const blogForm = () => (
    <form onSubmit={addBlog}>
      title:<input
        value={title}
        onChange={({ target }) => setTitle(target.value)}
      />
      <br />
      author:<input 
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
      />
      <br />
      url:<input 
        value={url}
        onChange={({ target }) => setUrl(target.value)}
      />
      <br />
      likes: <input
        value={likes}
        onChange={({ target }) => setLikes(target.value)}
        type='number'
       />
      <br />
      <button type="submit">save</button>
    </form>
  )

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url,
      likes,
    }

    try{
      const result = await blogService.create(blogObject)  
      setBlogs(blogs.concat(result))
      setErrorMessage(`a new blog ${title} by ${author} added`)
      setType(1)
      setTitle('')
      setAuthor('')
      setUrl('')
      setLikes(0)
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

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={type} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} is logged in<button onClick={handleLogout}>logout</button></p>
        {blogForm()}
        </div>}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App