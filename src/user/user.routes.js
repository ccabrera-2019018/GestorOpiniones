import express from "express";
import { validateJwt } from "../middlewares/validate-jws.js";
import { deleteU, login, register, test, update } from "./user.controller.js";

const api = express.Router()

//RUTAS PUBLICAS

api.post('/register', register)
api.post('/login', login)

//RUTAS PRIVADAS (solo usuarios logeados)
                    //Middleware
api.get('/test', [validateJwt], test)
api.put('/update/:id', [validateJwt], update) //Middleware -> funciones intermedias que sirven para validar

export default api