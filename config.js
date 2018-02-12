'use strict'
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blogData'
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-blogData'
exports.PORT = process.env.PORT || 8080
