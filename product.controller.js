import pool from "../config/db.js"; 
import dotenv from "dotenv";

dotenv.config();

export const getAllproducts = async (req,res) =>{

    try{
        const result = await pool.query(`SELECT * FROM  products`);

       return res.status(200).json({
            message:'welcome   to   all  product   history   from  manneeru @farookcircle.com',
            res:result.rows
        });
    }catch(err){

        return res.status(500).json({
            message:'server  error  please  contact(07085037870 via whatsapp only)'  
        })
    }
}
export const  addProduct = async (req, res) => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({
            message: "Please provide all fields.",
        });
    }

    try {
        const query = `INSERT INTO products (name, price, image) VALUES ($1, $2, $3) RETURNING *;`;
        const values = [name, price, image];
        const result = await pool.query(query, values);

        return res.status(201).json({
            message: "Product added successfully.",
            products: result.rows[0]
        });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
            message: "Server error, please contact Manneeru @ 09025338413",
            error: err.message, 
        });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params; 
    const { name, price, image } = req.body; 

    if (!name && !price && !image) {
        return res.status(400).json({
            message: "Please provide at least one field to update.",
        });
    }

    try {
        let query = "UPDATE products SET ";
        const values = [];
        const updates = [];

        if (name) {
            values.push(name);
            updates.push(`name = $${values.length}`);
        }
        if (price) {
            values.push(price);
            updates.push(`price = $${values.length}`);
        }
        if (image) {
            values.push(image);
            updates.push(`image = $${values.length}`);
        }

        values.push(id); 
        query += updates.join(", ") + ` WHERE id = $${values.length} RETURNING *;`;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            message: "Product updated successfully.",
            product: result.rows[0],
        });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
            message: "Server error, please contact support @whatsapp(09025338413).",
            error: err.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        return res.status(200).json({
            message: "Product deleted successfully.",
            deletedProduct: result.rows[0]
        });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
            message: "Server error, please contact support @whatsapp(09025338413).",
            error: err.message
        });
    }
};


