import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render, screen,  } from '@testing-library/react'

import BlogItem from './BlogItem'

describe('BlogItem', () => {

    let blog
    let user
    let handleLike

    beforeEach(() => {
        blog = {
            title: 'Component testing is done with react-testing-library',
            author: 'Test Author',
            url: 'http://localhost:3000',
            likes: 0,
            user: {
                username: 'johndoe',
                name: 'John Doe'
            }
          }
        
        handleLike = jest.fn();
        const handleDelete = jest.fn();
        user = { username: "johndoe",
        name: "John Doe" };
        
        render(<BlogItem blog={blog} handleLike={handleLike} handleDelete={handleDelete}
        blogLikes={blog.likes} user={user} />)
    })

    test('renders only title and author', () => {

        const titleElement = screen.getByText("Component testing is done with react-testing-library",{exact: false});
        const urlElement = screen.queryByText(blog.url); // Should not be present by default
        const likesElement = screen.queryByText(`${blog.likes} likes`); // Should not be present by default
        const nameElement = screen.queryByText(user.username); // Should not be present by default
        const removeButton = screen.queryByText("remove"); // Should not be present by default
        expect(titleElement).toBeInTheDocument();
        expect(urlElement).toBeNull();
        expect(likesElement).toBeNull();
        expect(nameElement).toBeNull();
        expect(removeButton).toBeNull();
    })

    test('should show details when view is clicked',() => {
        const viewButton = screen.getByText("view");
        fireEvent.click(viewButton);
        const urlElement = screen.queryByText(blog.url); // Should not be present by default
        const likesElement = screen.queryByText(blog.likes); // Should not be present by default
        const nameElement = screen.queryByText(user.name); // Should not be present by default

        expect(urlElement).toBeInTheDocument();
        expect(likesElement).toBeInTheDocument();
        expect(nameElement).toBeInTheDocument();
    })

    test('should update like twice', () => {
        const viewButton = screen.getByText("view");
        fireEvent.click(viewButton);
        const likeButton = screen.getByText('like')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        expect(handleLike).toHaveBeenCalledTimes(2)
    })
})