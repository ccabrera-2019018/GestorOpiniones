import express from "express";
import { validateJwt } from "../middlewares/validate-jwt.js";
import { deleteU, login, register, test, update } from "./user.controller.js";

const api = express.Router()



export default api