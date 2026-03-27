import express from "express";
import { adminLogin } from "../controllers/adminControler.js";

const adminRouter = express.Router();

// Admin login route
adminRouter.post("/login", adminLogin);

export default adminRouter;
