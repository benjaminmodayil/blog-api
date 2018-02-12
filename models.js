'use strict'
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  created: { type: Date, default: Date.now }
})

blogSchema.methods.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastname}`
})

blogSchema.methods.serialize = function() {
  return { title: this.title, content: this.content, author: this.author }
}

const Blog = mongoose.model('blogpost', blogSchema)
module.exports = { Blog }
