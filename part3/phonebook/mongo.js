const mongoose = require('mongoose')

let print_all = false
let send = false

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}else if(process.argv.length<4){
    print_all = true  
}else{
    send = true  
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://mustufasohail7:${password}@cluster0.bipus9m.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Person', phoneSchema)

// const note = new Note({
//   content: 'HTML is Easy',
//   important: true,
// })

if(send){
    const person = new Phonebook({
        name,
        number,
    })
    person.save().then(result => {
        console.log('phone number added!')
        mongoose.connection.close()
    })
}

if(print_all){
    Phonebook.find({}).then(result => {
        result.forEach(note => {
          console.log(note)
        })
        mongoose.connection.close()
    })
}
// Note.find({important: true}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
// })