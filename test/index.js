import koa from 'koa'
import router from '../dist'
import request from 'supertest'

describe('routes', () => {
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

    it('special url', (done) => {
        var app = koa()

        app.use(router('test/controllers', {
            routes : [
                {url : '/:category/:title', controller : '/test'}
            ]
        }))

        request(app.listen())
            .get('/hello/world')
            .expect('hello world', done)
    })

    it('special url not found', (done) => {
        var app = koa()

        app.use(router('test/controllers', {
            routes : [
                {url : '/:category/:title', controller : '/test'},
                {url : '/:category/:title', controller : '/test'},
                {url : '/:category/:title', controller : '/test'},
                {url : '/:category/:title', controller : '/test'}
            ]
        }))

        request(app.listen())
            .get('/test')
            .expect('test', done)
    })
})
