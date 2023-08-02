import { useState } from "react"

import './Blog.css'

import blogService from '../services/blogs'

const Blog = ({blog,user,setBlogs}) => {

  const [show,setShow] = useState(false)
  const [blogLikes,setBlogLikes] = useState(blog.likes)

  const handleLike  = async (id) => {
    await blogService.update(id)
    setBlogLikes(prev => prev + 1)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      setBlogs(prev => prev.filter(b => b.id !== blog.id))
    }
  }

  let isOwner
  try {
    isOwner = blog.user.username === user.username 
  } catch (error) {
    isOwner = false
  }

  return (
    <div className="blog-container">
      {blog.title}
      <button onClick={() => setShow(!show)}>
        {show ? 'hide' : 'view'}
      </button>
      {show &&
      <div>
        <p>{blog.url}</p>
        <p>{blogLikes}<button onClick={() => handleLike(blog.id)}>like</button></p>
        <p>{blog.user.name}</p>
        {isOwner && <button onClick={handleDelete}>remove</button>}
      </div>

      } 
    </div>  
  )
}

export default Blog