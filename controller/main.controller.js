import dotenv from "dotenv"
import pool from  "../config/database.js"

dotenv.config();

export const getAllUser = async(req,res) =>{

    try {
        const query  = `SELECT * FROM auth`
        const result = await pool.query(query);

        return res.status(200).json({
            message:"welcome to farookcircle web-dev company nig ltd..",
            result:result.rows
        })
    } catch {
        return res.status(500).json({
            message:("server error,please  try  again later..",err,message)
        });
    };
};

