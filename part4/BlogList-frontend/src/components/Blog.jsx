import { useState } from "react"

import './Blog.css'

const Blog = ({blog}) => {

  const [show,setShow] = useState(false)

  return (
    <div className="blog-container">
      {blog.title}
      <button onClick={() => setShow(!show)}>
        {show ? 'hide' : 'view'}
      </button>
      {show &&
      <div>
        <p>{blog.url}</p>
        <p>{blog.likes} <button>like</button></p>
        <p>{blog.user.name}</p>
      </div>

      } 
    </div>  
  )
}

export default Blog