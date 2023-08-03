import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './blogForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = jest.fn()

  render(<BlogForm addBlog={createNote} />)

  const titleInput= screen.getAllByRole('textbox')[0]
  const authorInput= screen.getAllByRole('textbox')[1]
    const urlInput= screen.getAllByRole('textbox')[2]
    const sendButton = screen.getByText('save')

  await user.type(titleInput, 'This is Blog')
    await user.type(authorInput, 'This is Author')
    await user.type(urlInput, 'This is Url')
  await user.click(sendButton)

    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].title).toBe('This is Blog')
    expect(createNote.mock.calls[0][0].author).toBe('This is Author')
    expect(createNote.mock.calls[0][0].url).toBe('This is Url')
})