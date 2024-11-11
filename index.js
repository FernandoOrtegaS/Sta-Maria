import { neon } from '@neondatabase/serverless';
import { engine } from 'express-handlebars';
import express from 'express';
import cookieParser from 'cookie-parser';

const sql = neon('postgresql://neondb_owner:rpxY60mWIvHG@ep-nameless-scene-a5cyx3xc.us-east-2.aws.neon.tech/neondb?sslmode=require');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/images', express.static('images'));
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.render('index');
});

app.get('/asistencia', (req, res) => {
    res.render('asistencia');
})


const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));



