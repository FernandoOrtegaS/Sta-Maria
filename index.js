import { neon } from '@neondatabase/serverless';
import { engine } from 'express-handlebars';
import express from 'express';
import cookieParser from 'cookie-parser';

const sql = neon('postgresql://neondb_owner:HL5t9kjbCpEa@ep-winter-scene-a5bjck6t.us-east-2.aws.neon.tech/neondb?sslmode=require');

const app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/images', express.static('images'));
app.use(express.static('public'));

const context = {
    pf: 5.4, // Promedio real
    showWarning: 5.4 < 6, // Mostrar advertencia si es menor a 6
};


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
            FROM notasalumnosbasica 
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

  app.get('/media', (req, res) => {
    res.render('media');
})
app.get('/basica', (req, res) => {
    res.render('basica');
})

app.get('/curso/:id', async (req, res) => {
    const cursoId = req.params.id;
    try {
        const result = await sql`
            SELECT * 
            FROM notasalumnosbasica
            WHERE curso_id = ${cursoId}
        `;
        res.render('notascurso', { alumnos: result, curso: `Curso ${cursoId}` });
    } catch (err) {
        console.error('Error al obtener las notas:', err);
        res.status(500).send('Error al obtener las notas');
    }
});

app.get('/parvulariaasis', (req, res) => {
    res.render('parvulariaasist');
})

app.get('/basicaasis', (req, res) => {
    res.render('basicaasist');
})

app.get('/mediaasis', (req, res) => {
    res.render('mediaasist');
})

app.get('/consultaralumno', (req, res) => {
    res.render('consultaralmuno');
})

app.post('/filtro_alumno', async (req, res) => {
    const { alumno } = req.body;
    try {
        
        const result = await sql`
            SELECT l.*, j.cantidad, l.paginas, a.nombre AS autor_nombre,gl.tipo AS nombre_genero, e.nombre AS editorial_nombre, s.nombre AS seccion_nombre
            FROM libro l
            JOIN ejemplares j ON l.id_libro = j.id_libro
            JOIN autor a ON l.id_autor = a.id_autor
            JOIN editorial e ON l.id_editorial = e.id_editorial
            JOIN se_ubica su ON l.id_libro = su.id_libro  -- Relación entre libro y se_ubica
            JOIN seccion s ON su.id_seccion = s.id_seccion  -- Relación entre se_ubica y seccion
            JOIN genero_l gl ON l.id_libro = gl.id_libro
            WHERE s.nombre ILIKE ${'%' + seccion + '%'}  -- Filtra por sección
        `;
  
        res.render('consultaralmuno', { libros: result, alumno });
    } catch (err) {
        console.error('Error al filtrar libros por sección:', err);
        res.status(500).send('Error al filtrar libros por sección');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));