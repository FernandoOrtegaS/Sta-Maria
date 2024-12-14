import { neon } from '@neondatabase/serverless';
import { engine } from 'express-handlebars';
import express from 'express';
import cookieParser from 'cookie-parser';

const sql = neon('postgresql://neondb_owner:HL5t9kjbCpEa@ep-winter-scene-a5bjck6t.us-east-2.aws.neon.tech/neondb?sslmode=require');

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

// Este endpoint parece estar sobrando y podría estar causando problemas
// app.get('/notas', (req, res) => {
//     res.render('notas');
// });

app.get('/notas', async (req, res) => {
    try {
        
        const result = await sql`
            SELECT * 
            FROM notasalumnos 
        `;
  
        if (result.length > 0) {
            res.render('notas', { alumnos: result });
        } else {
            res.render('notas', { alumnos: [] });
        }
    } catch (err) {
        console.error('Error al obtener los préstamos no devueltos', err);
        res.status(500).send('Error al obtener los préstamos no devueltos');
    }
  });










const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));



