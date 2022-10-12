const express = require('express');
const bodyParser = require('body-parser');
const db = require('./query.js');
const app = express();
const env = require('./config');
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(express.json());


app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

let ip = '192.168.100.228';
app.listen(port,() => {
    console.log(`listening on port ${port} `);
})

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API '+env.NODE_ENV })
})


app.post('/grupo/insert', db.insertAuditoria)
app.get('/reportes/lista', db.reportesLista)
app.post('/curso/', db.getGrupoByClave)
app.get('/curso/:idCurso', db.getAlumnosByClaveGrupo)
app.get('/info/alumno/:curp', db.getInfoAlumnosByCURP)
app.post('/historial-supervisiones', db.historialSupervisiones)


