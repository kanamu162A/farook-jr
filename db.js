import  dotenv  from "dotenv";
dotenv.config();

import pg from "pg";
const { Pool } = pg;

const pool =  new Pool({

    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT 
});


pool.connect((err) =>{

    if(err){
        console.log(`fail  to  connect  to  database`);
        
    }else{
        console.log('database connected  sucessfully...');
        
    }
})

export default pool;
