import { useState } from "react"

import './Blog.css'

import blogService from '../services/blogs'
import BlogItem from "./BlogItem"

const Blog = ({blog,user,setBlogs}) => {

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

  return (
     <BlogItem blog={blog} handleLike={handleLike} handleDelete={handleDelete} blogLikes={blogLikes} user={user} />
  )
}

export default Blog