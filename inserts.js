const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: '8552',
    port: 5432,
})


const insertGrupo = (request, response) => {
    pool.query(
        'SELECT id,curso,cct,unidad,clave,mod,inicio,termino,area,espe,tcapacitacion, depen, tipo_curso FROM tbl_cursos ', (error, results) => {
            if (error) {
                throw error
            }
            console.log('getAllGrupos done');
            response.status(200).json(results.rows);
        }
    )
}

module.exports = {
    insertGrupo
}