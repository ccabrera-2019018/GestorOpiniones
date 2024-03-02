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


export const deletePublication = async(req, res)=>{
    try{
        let { id } = req.params;
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        let { username } = jwt.verify(authorization, secretKey)
        const publicacion = await Publication.findById(id);
        if(publicacion.username == username){
        let deletedPublication = await Publication.findOneAndDelete({_id: id})
        if(!deletedPublication) return res.status(404).send({message: 'Publication not found'})
        return res.send({message: `Publication ${deletedPublication.title} delete sucessfully`})
    } else {
        return res.status(400).send({ message: 'It cannot be deleted because it is not your publication.' })
    }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error delete publication'})
    }
}