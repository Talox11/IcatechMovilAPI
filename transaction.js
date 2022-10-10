const mysql = require('mysql2/promise');
const env = require('./config');

async function createNewAuditoria(grupo, alumnos) {
    const config = {
        db: { /* do not put password or any sensitive info here, done only for demo */
            host: env.MYSQL_DB_HOST || 'localhost',
            user: env.MYSQL_DB_USERNAME || 'root',
            password: env.MYSQL_DB_PASSWORD || '',
            database: env.MYSQL_DB_DATABASE || 'wwicat_db_auditoria',
            port: env.MYSQL_DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: env.DB_CONN_LIMIT || 10,
            queueLimit: 0,
            debug: env.DB_DEBUG || false
        },
    };

    
    const connection = await mysql.createConnection(config.db);
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    
    await connection.beginTransaction();
    try {
        
        var g = JSON.parse(grupo);
        let stmtG = "INSERT INTO `grupo_auditado` (`id`, `curso`, `cct`, `unidad`, `clave`, `mod`, `area`, `espe`, `tcapacitacion`, `depen`, `tipo_curso`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let itemG = [g.curso, g.cct, g.unidad, g.clave, g.mod, g.area, g.espe, g.tcapacitacion, g.depen, g.tipo_curso];
        
        var result = await connection.execute(stmtG, itemG);
        var grupoIdInserted = result[0]['insertId'];

        
        var a = JSON.parse(alumnos);
        let stmtA = "INSERT INTO `alumno_auditado` (`id`, `nombre`, `curp`, `matricula`, `apellido_paterno`, `apellido_materno`, `correo`, `telefono`, `sexo`, `fecha_nacimiento`, `domicilio`, `estado`, `estado_civil`, `entidad_nacimiento`, `seccion_vota`, `calle`, `num_ext`, `num_int`, `observaciones`, `resp_satisfaccion`, `com_satisfaccion`, `id_curso`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        for(var i in a){
            let itemA = [ a[i].nombre, a[i].curp, a[i].matricula, a[i].apellido_paterno, a[i].apellido_materno, a[i].correo, a[i].telefono, a[i].sexo, a[i].fecha_nacimiento, a[i].domicilio, a[i].estado, a[i].estado_civil, a[i].entidad_nacimiento, a[i].seccion_vota, a[i].calle , a[i].numExt, a[i].numInt, a[i].observaciones, a[i].resp_satisfaccion, a[i].com_satisfaccion, grupoIdInserted];
            await connection.execute(stmtA, itemA);
        }
        console.log('Grupo inserted\nAlumnos inserted');
        await connection.commit();
        return `done`;
    } catch (err) {
        console.error(`Error occurred while creating register: ${err.message}`, err);
        connection.rollback();
        console.info('Rollback successful');
        return 'err';
    }
}

async function cursoUltimaSupervision(grupo) {
    const config = {
        db: { /* do not put password or any sensitive info here, done only for demo */
            host: env.MYSQL_DB_HOST || 'localhost',
            user: env.MYSQL_DB_USERNAME || 'root',
            password: env.MYSQL_DB_PASSWORD || '',
            database: env.MYSQL_DB_DATABASE || 'wwicat_db_auditoria',
            port: env.MYSQL_DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: env.DB_CONN_LIMIT || 10,
            queueLimit: 0,
            debug: env.DB_DEBUG || false
        },
    };

    
    const connection = await mysql.createConnection(config.db);
    await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    
    await connection.beginTransaction();
    try {
        
        var g = JSON.parse(grupo);
        
        let stmtG = "SELECT * FROM `grupo_auditado` where id = ?";
        let itemG = [g];
        
        var result = await connection.execute(stmtG, itemG);
        await connection.commit();
        return result[0][0];
    } catch (err) {
        console.error(`Error occurred while creating register: ${err.message}`, err);
        connection.rollback();
        console.info('Rollback successful');
        return 'err';
    }
}
module.exports = {
    createNewAuditoria,
    cursoUltimaSupervision, 
}