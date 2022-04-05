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


const testMysql = (request, response) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query("SELECT * FROM test", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            response.status(200).json(result);
        });
        connection.release();
    });
}
const testMysqlId = (request, response) => {
    let id = request.params.id;
    var sql = 'SELECT * FROM test where id = ?';
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, [id], function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            response.status(200).json(result);
        });
        connection.release();
    });
}

const saveTest = (request, response) => {
    let title = request.body.title;
    let subtitle = request.body.subtitle;
    let ip = request.socket.remoteAddress
    var sql = "INSERT INTO test (tittle, subttilte) VALUES (?,?)";
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, [title, subtitle], function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            response.status(200).json('row inserted with id->'+result.insertId);
            console.log('request by -> '+ip);
        });
        connection.release();
    });
}
const updateTest = (request, response) => {
    let title = request.body.title;
    let subtitle = request.body.subtitle;
    let id = request.params.id;
    var sql = "UPDATE test SET tittle = ?, subttilte = ? WHERE id = ?";
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql, [title, subtitle, id], function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            response.status(200).json('row update ->'+result);
        });
        connection.release();
    });
}

const insertAuditoria = async (request, response) => {
    const grupo = request.body.grupo;
    const alumnos = request.body.alumnos;
    console.log(request.body);
    await trx.createNewAuditoria(grupo, alumnos).then((value) => {
        console.log(value);
        if (value == 'done') {
            response.status(201).json('inserted');
        } else {
            response.status(500).json('err');
        }
    });
    // process.exit(0);
}

const getAllGrupos = (request, response) => {
    pgPool.query(
        'SELECT id,curso,cct,unidad,clave,mod,inicio,termino,area,espe,tcapacitacion, depen, tipo_curso FROM tbl_cursos limit 1', (error, results) => {
            if (error) {
                throw error
            }
            console.log('getAllGrupos done');
            response.status(200).json(results.rows);
        }
    )
}

const getAllAlumnosInscritos = (request, response) => {
    pgPool.query(
        'SELECT id,matricula,alumno,curp,id_curso FROM tbl_inscripcion limit 3000', (error, results) => {
            if (error) {
                throw error
            }
            console.log('getAllAlumnosInscritos done');
            response.status(200).json(results.rows);
        }
    )
}

const getAllAlumnosPre = (request, response) => {
    pgPool.query(
        'SELECT id, nombre, apellido_paterno, apellido_materno, correo,telefono, curp, sexo, fecha_nacimiento, domicilio, colonia, municipio,estado, estado_civil, matricula  FROM alumnos_pre  limit 3000', (error, results) => {
            if (error) {
                throw error
            }
            console.log('getAllAlumnosPre done');
            response.status(200).json(results.rows);
        }
    )
}

const getGrupoByClave = (request, response) => {

    const clave = request.body.clave;
    console.log(clave);
    pgPool.query(
        'SELECT id,curso,cct,unidad,clave, mod,inicio,termino, area, espe, tcapacitacion, depen,tipo_curso FROM tbl_cursos ' + ''
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


module.exports = {
    testMysql,
    testMysqlId,
    saveTest,
    updateTest,
    insertAuditoria,
    getAllGrupos,
    getAllAlumnosInscritos,
    getAllAlumnosPre,
    getGrupoByClave,
    getAlumnosByClaveGrupo,
    getInfoAlumnosByCURP
}