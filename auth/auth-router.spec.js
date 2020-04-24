  
const request = require('supertest');
const db = require('../database/dbConfig');
const server = require ('../api/server');


beforeEach(async () => {
    await db('users').truncate();
});


describe('POST /api/auth/register', () => {
    it('Responds with 201', async done => {
        let res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'alan',
                password: 'password'
            })
        expect(res.status).toBe(201);
        done();
    })

    it('Responds with error adding user if no password provided', async done => {
        let res = await request(server)
        .post('/api/auth/register')
        .send({
            username: 'alan'
    
        })
        expect(res.status).toBe(500)
        done()
    })
    

})

describe('POST /api/auth/login', () => {
    it('Responds with 200', async done => {
        // Post user to db
        let res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'alan',
                password: 'password'
            })
        expect(res.status).toBe(201);

        // Login with same credentials
        res = await request(server)
            .post('/api/auth/login')
            .send({
                username: 'alan',
                password: 'password'
            })
        expect(res.status).toBe(200);
        done();
    })
    it('Responds with 404 when invalid credentials', async done => {
        // Post user to db
        let res = await request(server)
            .post('/api/auth/register')
            .send({
                username: 'alan',
                password: 'password'
            })
        expect(res.status).toBe(201);

        // Login with user that does not exist
        res = await request(server)
            .post('/api/auth/login')
            .send({
                username: 'alan',
                password: 'wrongpassword'
            })
        expect(res.status).toBe(401);
        done();
    })
})



describe('GET /api/jokes', () => {
    it('Responds with 400 if not authenticated', async done => {
        let res = await request(server)
        .get('/api/jokes')
        expect(res.status).toBe(400);
        done();
    })
    it('Message says <You shall not pass> if not authenticated', async done => {
        res = await request(server)
        .get('/api/jokes')
        expect(res.body.message).toBe('You shall not pass');
        done();
    })
})