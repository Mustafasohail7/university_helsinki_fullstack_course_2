const BlogForm = ({title,author,url,likes,setTitle,setAuthor,setUrl,setLikes,addBlog}) => {

  return (
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
}

export default BlogForm
