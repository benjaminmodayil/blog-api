const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const { BlogPosts } = require('./models')

// Recipes.create('boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt'])
// Recipes.create('milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk'])
// 👆 create some fake posts
BlogPosts.create(
  'My first blog',
  'Lorem ipsum dolor sit amet, natum mollis mediocritatem eam cu. Utamur tacimates cu mei, at posse luptatum usu, cu ludus ancillae postulant qui. Duo accumsan atomorum comprehensam in? Id qui illum malis appareat, pro nulla mentitum molestiae an.',
  'Benjamin Mathew'
)

BlogPosts.create(
  'My second blog',
  'Lorem pip dolor sit amet, natum mollis mediocritatem eam cu. Utamur tacimates cu mei, at posse luptatum usu, cu ludus ancillae postulant qui. Duo accumsan atomorum comprehensam in? Id qui illum malis appareat, pro nulla mentitum molestiae an.',
  'Ed Mathew'
)

BlogPosts.create(
  'third lol',
  'Lorem ipsum dolor sit amet, natum mollis mediocritatem eam cu. Utamur tacimates cu mei, at posse luptatum usu, cu ludus ancillae postulant qui. Duo accumsan atomorum comprehensam in? Id qui illum malis appareat, pro nulla mentitum molestiae an.',
  'Benjamin Mathew'
)

BlogPosts.create(
  'My fourth blog',
  'Lorem pip dolor sit amet, natum mollis mediocritatem eam cu. Utamur tacimates cu mei, at posse luptatum usu, cu ludus ancillae postulant qui. Duo accumsan atomorum comprehensam in? Id qui illum malis appareat, pro nulla mentitum molestiae an.',
  'Ed Mathew'
)

// GET and POST requests should go to /blog-posts.

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
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author)
  res.status(201).json(item)
})

// DELETE and PUT requests should go to /blog-posts/:id.

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id)
  console.log(`deleted blog post with id of ${req.params.id}`)
  res.status(204).end()
})

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'author', 'content']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]

    if (!field in req.body) {
      const message = `Missing ${field} in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request path ${req.params.id} and request body id ${
      req.body.id
    } must match`
    console.error(message)
    return res.status(400).send(message)
  }

  console.log(`updated blog post with id of ${req.params.id}`)

  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    author: req.body.author,
    content: req.body.content
  })

  res.status(204).end()
})

// Use Express router and modularize routes to /blog-posts.

router.get('/', (req, res) => {
  res.json(BlogPosts.get())
})

module.exports = router
