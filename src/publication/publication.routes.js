import express from "express";
import { validateJwt } from "../middlewares/validate-jws.js";
import { createPublication } from "./publication.controller.js";

const api = express.Router()

api.post('/createPublication', createPublication)


export default api