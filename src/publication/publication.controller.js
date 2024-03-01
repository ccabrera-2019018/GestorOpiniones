'use strict'

import Publication from './publication.model.js'
import jwt  from 'jsonwebtoken'

export const createPublication = async (req, res) => {
    try {
        //Obtener la llave de acceso
        let secretKey = process.env.SECRET_KEY
        //obtener el token
        let { authorization } = req.headers
        let { username } = jwt.verify(authorization, secretKey)
        //Capturar el formulario (body)
        let data = req.body
        data.username = username
        //Guardar la informacion de la BD
        let publication = new Publication(data)
        await publication.save()
        //Responder al usuario
        return res.send({ message: `Post shared correctly` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error post not shared'})
    }
}

