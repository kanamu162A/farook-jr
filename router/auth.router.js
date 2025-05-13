import express from "express";
import {
  register,
  login,
  unblockUser,
  reset_password
} from "../controller/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",  login);
router.post("/unblock", unblockUser);
router.post("/reset-password", reset_password);

export default router;
