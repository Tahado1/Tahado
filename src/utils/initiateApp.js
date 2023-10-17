import morgan from 'morgan';
import { connectionDB } from '../../DB/connection.js'
import * as Routers from '../index.router.js'
import { globalResponse } from './errorHandling.js'
import session from 'express-session'
import passport from 'passport'

const initiateApp = (app, express) => {
    const port = process.env.PORT || 5000;
    //express.json
    app.use(express.json({}))
    //app.use(morgan('dev'))
    //routing

    app.use(`${process.env.BASE_URL}/auth`, Routers.authRouter)
    app.use(session({ secret: 'tahado', resave: false, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());

    //connectionDB
    connectionDB()
    //listenning
    app.all('*', (req, res, next) => {
        res.send("IN-VALID ROUTING plz check url or method")
    })
    app.use(globalResponse)
    app.listen(port, () => console.log(`listening on port ${port}!`))
}

export default initiateApp