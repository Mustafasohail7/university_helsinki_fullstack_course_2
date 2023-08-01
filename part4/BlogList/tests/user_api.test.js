const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}


// test('user cannot be created withour username', async () => {
//     const newUser = new User({
//         name: 'test',
//         password: 'test'
//     })

//     await api
//         .post('/api/users')
//         .send(newUser)
//         .expect(400)
// })

// test('user cannot be created without password',async () => {
//     const newUser = new User({
//         username: 'test',
//         name: 'test'
//     })

//     await api
//         .post('/api/users')
//         .send(newUser)
//         .expect(400)
// })

describe('when there is initially one user in db', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('test',10)
        const user = new User({ username: 'root', name: 'myname' , passwordHash })
        await user.save()
    },10000)

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDb()

        console.log(usersAtStart)

        const newUser = {
            username: 'test123',
            name: 'testytest',
            password: 'this is hashed'
        }

        await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)

    },10000)

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'this is not hashed'
        }

        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')
        
        const usersAtEnd = await usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

})