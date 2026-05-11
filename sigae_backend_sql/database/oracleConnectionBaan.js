import { config } from 'dotenv';
import oracledb from 'oracledb';
import { fileURLToPath } from 'url';
import path from 'path';


// Configuración de dotenv
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const variable_baan= process.env.VARIABLE_BAAN;
let oracleLibDir;

oracleLibDir = process.env.ORACLE_LIB_DIR ; 
/* if(variable_baan == 0){
oracleLibDir = process.env.ORACLE_LIB_DIR || '/myback/OracleClient';

}
else{
    oracleLibDir = './OracleClient/instantclient_19_8'; 

}
 */
// Inicialización del cliente Oracle
oracledb.initOracleClient({ libDir: path.join(__dirname, oracleLibDir) });


// Configuración de la conexión a la base de datos Oracle
const oraConfig = {
    user: process.env.ORA_USERBAAN,
    password: process.env.ORA_PASSWORDBAAN,
    connectString: process.env.ORA_CONN_STRINGBAAN,
    externalAuth: false,
}

// Función para obtener la conexión a la base de datos
export async function getOraConn(){
    try {
        // Obtener la conexión desde la piscina
        const pool = await oracledb.getConnection(oraConfig);
        return pool;
    } catch (error) {
        console.error(error.message)
    }
}