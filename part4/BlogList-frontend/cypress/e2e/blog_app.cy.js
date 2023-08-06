describe('Blog app', function() {

  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Test Icle',
      username: 'test user',
      password: 'test123'
    }
    cy.addUser(user)
  })

  it('front page can be opened', function() {
    cy.contains('blogs')
  })

  it('login form is shown', function() {
    cy.contains('login').click()
  })

  describe('Login',function() {
    it('login succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('test user')
      cy.get('#password').type('test123')
      cy.get('#login-button').click()

      cy.contains('Test Icle is logged in')
    })

    it('login fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
  
      cy.contains('Wrong credentials')
      cy.get('.error').should('have.css', 'background-color', 'rgb(244, 67, 54)')
    })
  })

  describe('When Logged In', function() {
    beforeEach(function() {
      cy.login({ username: 'test user', password: 'test123' })
    })

    it('a new blog can be created',function(){
      // cy.contains('new blog').click()
      // cy.get('#title').type('test blog from cypress')
      // cy.get('#author').type('test author from cypress')
      // cy.get('#url').type('test url from cypress')
      // cy.contains('save').click()
      cy.createBlog({ title: 'test blog from cypress', author: 'test author from cypress', url: 'test url from cypress', likes: 34 })
      cy.contains('test blog from cypress')
    })
  })

  describe('When a blog exists', function () {
    beforeEach(function(){
      cy.login({ username: 'test user', password: 'test123' })
      cy.createBlog({ title: 'test blog from cypress', author: 'test author from cypress', url: 'test url from cypress', likes: 34 })
    })

    it('a blog can be liked',function() {
      cy.contains('view').click()
      cy.contains('hide').parent().parent().get('#like-button').as('theLikeButton')
      cy.get('@theLikeButton').click()
      cy.contains('35')
    })

    it('a blog can be deleted',function() {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'test blog from cypress')
    })

    it('only the creator can see the remove button',function() {
      cy.contains('logout').click()
      const newUser = {
        name: 'Test Icle 2',
        username: 'test user 2',
        password: 'test123'
      }
      cy.addUser(newUser)
      cy.login({username: newUser.username,password: newUser.password})
      cy.contains('view').click()
      cy.contains('hide').parent().parent().should('not.contain', 'remove')
    })

    it.only('blogs are ordered according to likes',function() {
      cy.createBlog({ title: 'test blog from cypress 2', author: 'test author from cypress 2', url: 'test url from cypress 2', likes: 36 })
      cy.get('.blog-container').eq(0).should('contain', 'test blog from cypress 2')
      cy.get('.blog-container').eq(1).should('contain', 'test blog from cypress')
      // cy.get('.blog-container').eq(1).contains('view').click()
      // cy.get('.blog-container').eq(1).contains('hide').parent().parent().get('#like-button').as('theLikeButton')
      // cy.get('@theLikeButton').click()
    })
  })
})