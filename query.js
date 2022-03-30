const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: '8552',
    port: 5432,
})


const getAllGrupos = (request, response) => {
    pool.query(
        'SELECT id,curso,cct,unidad,clave,mod,inicio,termino,area,espe,tcapacitacion, depen, tipo_curso FROM tbl_cursos limit 3000', (error, results) => {
            if (error) {
                throw error
            }
            console.log('getAllGrupos done');
            response.status(200).json(results.rows);
        }
    )
}

const getAllAlumnosInscritos = (request, response) => {
    pool.query(
        'SELECT id,matricula,alumno,curp,id_curso FROM tbl_inscripcion limit 3000', (error, results) => {
            if (error) {
                throw error
            }
            console.log('getAllAlumnosInscritos done');
            response.status(200).json(results.rows);
        }
    )
}

const getAllAlumnosPre= (request, response) => {
        pool.query(
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
    pool.query(
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

    pool.query(
            'SELECT P.id,I.matricula, P.nombre, P.apellido_paterno, P.apellido_materno, P.correo, P.telefono, P.sexo, '+''+
            ' P.fecha_nacimiento, P.domicilio, P.colonia, P.municipio, P.estado, P.estado_civil, I.curp,I.id_curso FROM tbl_inscripcion as I  '+''+
            ' INNER JOIN alumnos_pre AS P on P.curp = I.curp' +''+
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

    pool.query(
        'SELECT id as id_alumno, nombre, curp, matricula, apellido_paterno, apellido_materno, '+''
        +' correo, telefono, sexo, fecha_nacimiento, domicilio, estado'+' '
        +' FROM alumnos_pre ' + ''
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
    getAllGrupos,
    getAllAlumnosInscritos,
    getAllAlumnosPre,
    getGrupoByClave,
    getAlumnosByClaveGrupo,
    getInfoAlumnosByCURP
}