const chai = require('chai')
const chaiHttp = require('chai-http')

const { app, runServer, closeServer } = require('../server')

const expect = chai.expect
chai.use(chaiHttp)

describe('Blog API', function() {
  before(function() {
    return runServer()
  })

  after(function() {
    return closeServer()
  })

  it('should get a list of items on GET', function() {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.a('array')

        expect(res.body.length).to.be.at.least(1)
      })
  })

  it('should add items on POST', function() {
    let newItem = {
      title: 'Test Blog Title',
      author: 'Ben Testodayil',
      content:
        'Lorem ipsum dolor sit amet, natum mollis mediocritatem eam cu. Utamur tacimates cu mei, at posse luptatum usu, cu ludus ancillae postulant qui. Duo accumsan atomorum comprehensam in? Id qui illum malis appareat, pro nulla mentitum molestiae an.'
    }

    return chai
      .request(app)
      .post('/blog-posts')
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201)
        expect(res).to.be.json
        expect(res.body).to.be.a('object')
        expect(res.body).to.include.keys('title', 'author', 'content')

        expect(res.body).to.deep.equal(
          Object.assign(newItem, {
            id: res.body.id,
            publishDate: res.body.publishDate
          })
        )
      })
  })

  it('should update posts on PUT', function() {
    const updateData = {
      title: 'Example Title',
      author: 'Example author',
      content:
        'Lorem ipsum dolor sit amet, natum mollis mediocritatem eam cu. Utamur tacimates cu mei, at posse luptatum usu, cu ludus ancillae postulant qui. Duo accumsan atomorum comprehensam in? Id qui illum malis appareat, pro nulla mentitum molestiae an.'
    }
    return chai
      .request(app)
      .get('/blog-posts')
      .send(updateData)
      .then(function(res) {
        updateData.id = res.body[0].id
        return chai
          .request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        expect(res).to.have.status(204)
        expect(res.body).to.be.an('object')
      })
  })

  it('should delete an item on DELETE', function() {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app).delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res) {
        expect(res).to.have.status(204)
      })
  })
})
