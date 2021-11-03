// Get config from .env file
import dotenv from 'dotenv'
dotenv.config()

// Import modules
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

// Set up Express app (views, static files, etc.)
export const app = express()
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug') // change ejs to whatever you want
app.use(express.static('./public'))
app.use(cookieParser(process.env.COOKIE_SECRET))

// body-parser setup
import bodyParser from 'body-parser'
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)

// Automatically configure Express routes
import routes from './core/all_routes'
Object.entries(routes).forEach(([_, Route]) => {
    new Route().run(app)
})

// 404 middleware
app.use((req, res, next) => {
    res.status(404).render('render/404')
})

// Start the Express server
app.listen(process.env.PORT || 6904)
console.log(`Server started on port ${process.env.PORT || 6904}`)
