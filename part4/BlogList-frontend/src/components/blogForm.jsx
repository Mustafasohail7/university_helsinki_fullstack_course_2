import { useState } from "react"

const BlogForm = ({addBlog}) => {

    const [title,setTitle] = useState('')
    const [author,setAuthor] = useState('')
    const [url,setUrl] = useState('')
    const [likes,setLikes] = useState(0)

    const handleSubmit = (event) => {
        event.preventDefault()
        addBlog({title,author,url,likes})
        setTitle('')
        setAuthor('')
        setUrl('')
        setLikes(0)
    }

    return (
    <form onSubmit={handleSubmit}>
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
}

export default BlogForm
