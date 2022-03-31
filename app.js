const express = require('express');
const bodyParser = require('body-parser');
const db = require('./query.js');
const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(express.json());


app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})


app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API ' })
})


app.post('/grupo/insert', db.insertAuditoria)

app.get('/list/grupo', db.getAllGrupos)
app.get('/list/alumnosInscritos', db.getAllAlumnosInscritos)
app.get('/list/alumnosPre', db.getAllAlumnosPre)
app.post('/curso/', db.getGrupoByClave)
app.get('/curso/:idCurso', db.getAlumnosByClaveGrupo)
app.get('/info/alumno/:curp', db.getInfoAlumnosByCURP)

