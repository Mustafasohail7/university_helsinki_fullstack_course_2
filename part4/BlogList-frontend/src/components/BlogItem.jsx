import { useState } from "react"

const BlogItem = ({blog,handleLike,handleDelete,blogLikes,user}) => {

    const [show,setShow] = useState(false)

    let isOwner
  try {
    isOwner = blog.user.username === user.username 
  } catch (error) {
    isOwner = false
  }

  return (
    <div className="blog-container">
      <p>{blog.title} by {blog.author} <button onClick={() => setShow(!show)}>
        {show ? 'hide' : 'view'}
      </button> </p>
      {show &&
        <div>
          <p>{blog.url}</p>
          <p>{blogLikes}<button onClick={() => handleLike(blog.id)}>like</button></p>
          <p>{blog.user.name}</p>
          {isOwner && <button onClick={handleDelete}>remove</button>}
        </div>} 
    </div> 
  )
}

export default BlogItem
