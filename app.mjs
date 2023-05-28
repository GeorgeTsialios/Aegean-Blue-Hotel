import dotenv from 'dotenv';
import express from 'express';
import { engine } from 'express-handlebars';
import expSession from 'express-session';
import connectPg from 'connect-pg-simple';
import * as Routers from './routers/index.mjs'; 
import { ApiControllers, FrontEndControllers } from './controllers/index.mjs';
import * as DatabaseClient from './model/databaseClient.mjs';


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

app.use(async (err, req, res, next) => {
    
    console.log('Κάποιο σφάλμα συνέβη');
    const client = await DatabaseClient.createConnection();
    const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
    const hotel = await ApiControllers.HotelController.returnHotel(client);
    const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);

    // next(err); // καλούμε τον επόμενο χειριστή σφαλμάτων
    res.status(500);
    res.render(
        'error',
        {
            title: "Internal server error",
            hotel: hotel,
            account: account,
            roomTypes: roomTypes,
            serverError: true
        }
    );
});

app.listen(PORT);