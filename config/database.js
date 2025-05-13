import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config();
const {Pool} =pkg;

const pool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
    
});

pool.connect((err) =>{
    if(!err){
        console.log(`Database connected successfully...`);
        
    }else{
        console.log(`Fail to connect database, try again later...`,err.message);
        
    };
});

export default pool;