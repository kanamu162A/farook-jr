import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/product.routes.js"; 

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors()); 

app.use("", productRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Product API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
