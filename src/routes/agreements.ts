import Route from '../core/route'
import Express from 'express'
import fs from 'fs'

const script = (req: Express.Request, res: Express.Response) => {
    let message = req.signedCookies.message
    res.clearCookie('message')

    let adminMessage = JSON.parse(
        fs.readFileSync('./data/admin_message.json', 'utf8')
    )
    return res.render('render/agreements', {
        message: message,
        adminMessage: adminMessage === {} ? undefined : adminMessage,
    })
}

export default class TwoFactorAuthGet extends Route {
    /**
     * @inheritdoc
     * @param {string} path
     * @param {string} method
     * @param {function} callback
     * @returns {void}
     **/

    constructor() {
        super('/agreements', 'get', script)
    }
}
