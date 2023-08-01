const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async(request, response) => {
    const users = await User.find({}).populate('notes',{title: 1, author: 1, url: 1, likes: 1})
    console.log(users)
    response.json(users)
})

userRouter.post('/', async(request, response) => {
    const {username,name,password} = request.body

    if(password.length < 3){
        return response.status(400).json({
            error: 'password must be at least 3 characters long'
        })
    }

    if(!password){
        return response.status(400).json({
            error: 'password is required'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password,saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter