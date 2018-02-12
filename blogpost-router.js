const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { Blog } = require('./models')

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]

    if (!field in req.body) {
      const message = `Missing ${field} in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }

  Blog.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'Internal server error' })
    })
})

router.delete('/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id)
    .then(post => {
      console.log(`deleted blog post with id of ${req.params.id}`)
      res.status(204).end()
    })
    .catch(err => res.status(500).json(message`${err}`))
})

router.put('/:id', jsonParser, (req, res) => {
  if (!(req.body.id && req.params.id && req.params.id === req.body.id)) {
    const message = `Request path ID (${req.params.id}) and request body ID (${
      req.body.id
    }) do no match`

    console.error(message)
    return res.status(400).json({ message: message })
  }

  const toUpdate = {}
  const updateableFields = ['title', 'author', 'content', 'created']

  updateableFields.map(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field]
    }
  })

  Restaurant.findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }))
})

// Use Express router and modularize routes to /blog-posts.

router.get('/', (req, res) => {
  Blog.find()
    .limit(10)
    .then(blogPosts => {
      res.json(blogPosts.map(post => post))
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Internal server error' })
    })
})

router.get('/:id', (req, res) => {
  Blog.findById(req.params.id)
    .then(blogPost => {
      res.json(blogPost)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Internal server error' })
    })
})
module.exports = router
