import express from "express";
import {getAllUser} from "../controller/main.controller.js"
const router = express.Router();


router.get("/users", getAllUser);

export default router;