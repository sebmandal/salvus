import Route from '../core/route'
import Express from 'express'
import fs from 'fs'

const script = (req: Express.Request, res: Express.Response) => {
    if (!req.signedCookies.user) return res.redirect('/login')
    if (req.signedCookies.user.name !== 'sebmandal') {
        res.cookie(
            'message',
            {
                content: "You don't have permission to view the backroom.",
                type: 'error',
            },
            { signed: true }
        )
        return res.redirect('/login')
    }

    let message = req.signedCookies.message
    res.clearCookie('message')

    let runMode = fs
        .readFileSync('./public/chat/index.js')
        .toString()
        .split('\n')[0]

    let adminMessage = JSON.parse(
        fs.readFileSync('./data/admin_message.json', 'utf8')
    )
    return res.render('render/backroom', {
        title: 'Backroom | Salvus',
        user: req.signedCookies.user,
        message: message,
        runMode: runMode.includes('localhost') ? 'development' : 'production',
        adminMessage: adminMessage === {} ? undefined : adminMessage,
    })
}

export default class BackroomGet extends Route {
    /**
     * @inheritdoc
     * @param {string} path
     * @param {string} method
     * @param {function} callback
     * @returns {void}
     **/

    constructor() {
        super('/backroom', 'get', script)
    }
}
