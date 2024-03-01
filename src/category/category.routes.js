import express from "express";
import { validateJwt } from "../middlewares/validate-jwt.js"
import { test, save, showsCategory } from "./category.controller.js"


const api = express.Router()

api.get('/test', [validateJwt], test)
api.post('/save', [validateJwt], save)
api.get('/showsCategory', [validateJwt], showsCategory)

export default api