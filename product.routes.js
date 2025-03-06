import express from "express";
import { addProduct, getAllproducts, updateProduct, deleteProduct } from "../controller/product.controller.js"; 

const router = express.Router();

router.get("/getAllProduct", getAllproducts);
router.post("/addProduct", addProduct);
router.put("/updateproduct/:id", updateProduct);
router.delete("/deleteproduct/:id", deleteProduct); 

export default router;
