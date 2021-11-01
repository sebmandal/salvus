import Route from '../core/route'
import Express from 'express'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const script = (req: Express.Request, res: Express.Response) => {
    if (!req.signedCookies.user) res.redirect('/')

    if (req.body.message && req.body.recipient) {
        let message = req.body.message
        let recipient = req.body.recipient
        let sender = req.signedCookies.user.name

        if (
            fs
                .readdirSync(`./data/users`)
                .find((user) => user.split('.')[0] == recipient)
        ) {
            // if the recipient exists, we will append the message to the recipient's messages_received
            let user = JSON.parse(
                fs.readFileSync(`./data/users/${recipient}.json`, 'utf-8')
            )
            let messages = user.messages_received
            messages.push({
                sender: sender,
                message: message,
            })
            user.messages_received = messages
            fs.writeFileSync(
                `./data/users/${recipient}.json`,
                JSON.stringify(user)
            )

            // we will append the message to the sender's messages_sent
            let user2 = JSON.parse(
                fs.readFileSync(`./data/users/${sender}.json`, 'utf-8')
            )
            let messages2 = user2.messages_sent
            messages2.push({
                sender: sender,
                message: message,
            })
            user2.messages_sent = messages2
            fs.writeFileSync(
                `./data/users/${sender}.json`,
                JSON.stringify(user2)
            )

            // letting the user know that the message was sent successfully and redirecting them to the inbox
            res.cookie(
                'message',
                {
                    content: 'Message sent successfully',
                    type: 'success',
                },
                { signed: true }
            )
            return res.redirect('/messages')
        }

        // if the recipient doesn't exist, we will let the user know that the recipient doesn't exist
        res.cookie(
            'message',
            {
                content: 'Error occured (user not found)',
                type: 'error',
            },
            { signed: true }
        )
        return res.redirect('/messages/send')
    }
}

export default class MessagesSendPost extends Route {
    /**
     * super()
     * parameter 1: the URL path
     * parameter 2: the Express routing method
     * parameter 3: the Express middleware/handler function
     **/
    constructor() {
        super('/messages/send', 'post', script)
    }
}
