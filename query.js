const Pool = require('pg').Pool
var mysql = require('mysql');
const env = require('./config');
const trx = require('./transaction');
const pgPool = new Pool({
    user: env.PG_DB_USERNAME,
    host: env.PG_DB_HOST,
    database: env.PG_DB_DATABASE,
    password: env.PG_DB_PASSWORD,
    port: env.PG_DB_PORT,
})


var mysql = require('mysql');
const { format } = require('express/lib/response');

var pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wwicat_db_auditoria'
});


const reportesLista = (request, response) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query("CALL reportes();", function (err, result, fields) {
            if (err) throw err;
            console.log(result[0]);
            response.status(200).json(result[0]);
        });
        connection.release();
    });
}

const insertAuditoria = async (request, response) => {
    const grupo = request.body.grupo;
    const alumnos = request.body.alumnos;
    const id_supervisor = request.body.id_supervisor;
    console.log(request.body);
    await trx.createNewAuditoria(grupo, alumnos, id_supervisor).then((value) => {
        
        if (value == 'done') {
            response.status(201).json('inserted');
        } else {
            response.status(500).json('err');
        }
    });
    
    // process.exit(0);
}
const getLastSupervision = async (request, response) => {
    const grupo = request.body.idCurso;
    await trx.cursoUltimaSupervision(grupo).then((value) => {
        response.status(200).json(value);
    });
    // process.exit(0);
}


const getGrupoByClave = (request, response) => {

    const clave = request.body.clave;
    console.log(clave);
    pgPool.query(
        'SELECT id, curso,cct,unidad,clave, mod,inicio,termino, area, espe, tcapacitacion, depen,tipo_curso FROM tbl_cursos ' + ''
        + '  WHERE clave = $1 ', [clave], (error, results) => {

            if (error) {
                throw error
            }
            console.log(results.rows);
            response.status(201).json(results.rows);
        }
    )
}

const getAlumnosByClaveGrupo = (request, response) => {
    const idCurso = parseInt(request.params.idCurso);

    pgPool.query(
        'SELECT P.id,I.matricula, P.nombre, P.apellido_paterno, P.apellido_materno, P.correo, P.telefono, P.sexo, ' + '' +
        ' P.fecha_nacimiento, P.domicilio, P.colonia, P.municipio, P.estado, P.estado_civil, I.curp,I.id_curso FROM tbl_inscripcion as I  ' + '' +
        ' INNER JOIN alumnos_pre AS P on P.curp = I.curp' + '' +
        ' WHERE i.id_curso = $1 ', [idCurso], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows);
        }
    )
}

const getInfoAlumnosByCURP = (request, response) => {
    const curp = (request.params.curp);

    pgPool.query(
        'SELECT id as id_alumno, nombre, curp, matricula, apellido_paterno, apellido_materno, ' + ''
        + ' correo, telefono, sexo, fecha_nacimiento, domicilio, estado' + ' '
        + ' FROM alumnos_pre ' + ''
        + '  WHERE curp = $1', [curp], (error, results) => {
            if (error) {
                throw error
            }
            console.log(results.rows);
            response.status(200).json(results.rows);
        }
    )
}

const getInfoReportes = (request, response) => {


}


module.exports = {
    reportesLista,
    insertAuditoria,
    getGrupoByClave,
    getAlumnosByClaveGrupo,
    getInfoAlumnosByCURP,
    getLastSupervision
}