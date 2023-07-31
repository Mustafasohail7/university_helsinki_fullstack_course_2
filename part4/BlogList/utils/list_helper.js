const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    return total
}

const favouriteBlog = (blogs) => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const favourite = blogs.find(blog => blog.likes === maxLikes)
    return favourite
}

const mostBlogs = (blogs) => {
    const blogCounts = _.mapValues(_.groupBy(blogs,'author'),(authorBlogs) => authorBlogs.length)

    const topAuthor = _.maxBy(_.keys(blogCounts), (author) => blogCounts[author])

    return {
        author: topAuthor,
        blogs: blogCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    const likeCounts = _.mapValues(_.groupBy(blogs,'author'),(authorBlogs) => _.sumBy(authorBlogs, 'likes'))
    const topAuthor = _.maxBy(_.keys(likeCounts), (author) => likeCounts[author])

    return {
        author: topAuthor,
        likes: likeCounts[topAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}