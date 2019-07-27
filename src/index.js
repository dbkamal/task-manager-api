const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     }else {
//         next()
//     }
// })

// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return cb(new Error('Upload Word only'))
//         }

//         cb(undefined, true)

//         // cb(new Error('File must be a PDF'))
//         // cb(undefined, true)
//     }
// })

// const errorMiddleware = (req, res, next) => {
//     throw new Error('From my middleware')
// }

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is running on ' + port)
})

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismycourse', {expiresIn: '2 days'})
//     console.log(token)

//     const payload = jwt.verify(token, 'thisismycourse')
//     console.log(payload)
// }

// myFunction()

// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function () {
//     return {a: 'b'}
// }

// console.log(JSON.stringify(pet))

// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     // const task = await Task.findById('5d354c355d825c9b77afeb70')    
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
    
//     const user = await User.findById('5d354ae8daa2889b1a4b3b36')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()
