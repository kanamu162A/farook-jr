import express from "express";
import cors from "cors";
import auth_router from "./router/auth.router.js"
import main from "./router/main.route.js"
import dotenv from "dotenv";
import render_router from "./router/ejs.router.js"

dotenv.config();
const port = process.env.PORT || 5000;
const app =  express();

app.set("view engine",'ejs')

app.use(express.json());
app.use(cors()); 
app.use("/api/manneeru/V1",auth_router);
app.use("/api/manneeru/V1",main);
app.use("/api/manneeru/V1",render_router);


app.listen(port, () =>{
    console.log(`server runing on port ${port} Succcessfully....`);
});
