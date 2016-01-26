import koa from 'koa'
import router from '../dist'
import request from 'supertest'

describe('render', () => {
    it('normal', (done) => {
        var app = koa()

        app.use(router('test/controllers'))

        request(app.listen())
            .get('/')
            .expect('hello', done)
    })

    it('not found', (done) => {
        var app = koa()

        app.use(router('test/controllers'))

        request(app.listen())
            .get('/hello')
            .expect(404, done)
    })
})
