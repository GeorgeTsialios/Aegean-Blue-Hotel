import dotenv from 'dotenv';
import express from 'express';
import { engine } from 'express-handlebars';
import expSession from 'express-session';
import connectPg from 'connect-pg-simple';
import * as Routers from './routers/index.mjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const pgSession = connectPg(expSession);

const sessionConf = {
    store: new pgSession({
        conString: process.env.DATABASE_URL
    }),
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    resave: false,
    saveUninitialized: false,
};

app.use(expSession(sessionConf));

app.use(express.static("public"));
app.use(express.json({limit: '6mb'}));
app.use(express.urlencoded({extended: false, limit: '6mb'}));

app.engine('hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use('/', Routers.FrontEndRouter.router);
app.use('/api', Routers.ApiRouter.router);

app.use(Routers.FrontEndRouter.error404);

app.listen(PORT);