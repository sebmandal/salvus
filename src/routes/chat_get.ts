import Route from '../core/route'
import Express from 'express'

import cookie from 'cookie'
import { app } from '../index'
import http from 'http'
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: { origin: '*' },
})
server.listen(6905)

// Opening the socket.io connection, allowing users to chat
io.on('connection', (socket: any) => {
    // When a user joins the chat, we send a message to the chat, ${username} has joined the chat
    // todo - this is probably not the best way to do this, but it works for now
    let username: any = 'Anonymous'
    if (!socket.handshake.headers.cookie) return
    else {
        let userCookies = cookie.parse(
            socket.handshake.headers.cookie.toString()
        )
        username = JSON.parse(
            userCookies.user.substr(4, userCookies.user.length - 48)
        ).name
    }

    io.emit('message', `${username} has joined the chat`)

    socket.on('message', (msg: string) => {
        io.emit('message', `${username} - ${msg}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', `${username} left the chat.`)
        socket.disconnect()
    })
})

const script = (req: Express.Request, res: Express.Response) => {
    if (!req.signedCookies.user) return res.redirect('/')

    let message = req.signedCookies.message
    res.cookie('message', undefined, { signed: true })

    return res.render('render/chat', { message: message })
}

export default class ChatGet extends Route {
    /**
     * @inheritdoc
     * @param {string} path
     * @param {string} method
     * @param {function} callback
     * @returns {void}
     **/

    constructor() {
        super('/chat', 'get', script)
    }
}
