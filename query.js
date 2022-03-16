const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: '8552',
    port: 5432,
})

const getGrupoByClave = (request, response) => {
    const clave = request.body.clave;
    console.log(clave);
    pool.query(
        'SELECT id,curso,cct,unidad,clave,inicio,termino FROM tbl_cursos ' + ''
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
        'SELECT DISTINCT i.matricula, i.alumno as nombre, i.curp ' + ''
        + ' FROM tbl_inscripcion AS i ' + ''
        + '  WHERE i.id_curso = $1 ', [idCurso], (error, results) => {
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
    getGrupoByClave,
    getAlumnosByClaveGrupo,
    getInfoAlumnosByCURP
}