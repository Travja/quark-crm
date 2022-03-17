import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Routes } from './routes/routes';

const app = express();

//Set up our app
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());

//Routing
const routes = new Routes();
// app.get('/', routes.create);
app.post("/login", routes.login);

/**   Registration   **/
// app.get('/register', routes.register);
// app.post('/register', urlencodedParser, routes.registerNewUser);
// app.get('/registered/:user', auth, routes.registered);
// app.get('/list', routes.list); //ONLY FOR TESTING

//API call to validate the Username hasn't been taken already.
// app.get('/validate/:user', routes.validateUser);
/** End Registration **/

/** Login **/
// app.get('/login', routes.login);
// app.post('/login', urlencodedParser, routes.verifyLogin);
/** End Login */

/** Edit **/
// app.get('/edit', auth, routes.edit);
// app.post('/edit', urlencodedParser, routes.postEdit);
// app.get('/edited', auth, routes.edited);
// app.get('/editAvatar', routes.editAvatar);
// app.post('/editAvatar', urlencodedParser, routes.postEditAvatar);
/** End Edit **/

// app.get('/logout', routes.logout);
// app.get('/stats', routes.stats);

// app.post('/delete', auth, routes.delete);

// app.get('/api', routes.api);

app.listen(5000, () => {
  console.log('Listening on port 5000');
});