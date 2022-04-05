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
    console.log(`listening on port ${port} =>${ip} `);
})


app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API '+env.NODE_ENV })
})

app.get('/test/mysql', db.testMysql);
app.get('/test/:id', db.testMysqlId);
app.post('/test/insert', db.saveTest);
app.post('/test/update/:id', db.updateTest);


app.post('/grupo/insert', db.insertAuditoria)

app.get('/list/grupo', db.getAllGrupos)
app.get('/list/alumnosInscritos', db.getAllAlumnosInscritos)
app.get('/list/alumnosPre', db.getAllAlumnosPre)
app.post('/curso/', db.getGrupoByClave)
app.get('/curso/:idCurso', db.getAlumnosByClaveGrupo)
app.get('/info/alumno/:curp', db.getInfoAlumnosByCURP)

