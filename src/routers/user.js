const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
// const { sendWelcomeEmail } = require('../emails/account')

const router = new express.Router()
const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Upload Valid Image File only'))
        }

        cb(undefined, true)
    }
})

// create new user API endpoint
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }
    catch(error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }
    catch(error) {
        res.status(400).send()
    }
})

// upload user's avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ 
        width: 250, height: 250
    }).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// delete user's avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }
    catch (error) {
        res.status(404).send()
    }
})

// read all users API endpoint
router.get('/users', auth, async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    }
    catch(error) {
        res.status(500).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send('Logout successfully.')
    }
    catch(error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logout successfully from all devices')
    }
    catch(error) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     }
//     catch(error) {
//         res.status(500).send(error)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        // const user = await User.findById(req.params.id)
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        await req.user.save()
        res.send(req.user)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

module.exports = router