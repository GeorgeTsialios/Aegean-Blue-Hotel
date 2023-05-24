import dotenv from 'dotenv';
import express from 'express';
import { engine } from 'express-handlebars';
import * as Routers from './routers/index.mjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static("public"));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: false, limit: '5mb'}));

app.engine('hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use('/', Routers.FrontEndRouter.router);
app.use('/api', Routers.ApiRouter.router);

app.use(Routers.FrontEndRouter.error404);

app.listen(PORT);