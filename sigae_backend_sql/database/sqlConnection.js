import sql from 'mssql';

import { config} from 'dotenv'
config();

const configDB = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
      encrypt:  false, 
      trustServerCertificate:  false 
    }
  };

const poolPromise = new sql.ConnectionPool(configDB)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.log('Database Connection Failed! Bad Config: ', err);
    throw err;
  });

export { sql, poolPromise };
