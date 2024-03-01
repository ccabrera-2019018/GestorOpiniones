'use strict'

import Category from './category.model.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const save = async (req, res) => {
    try {
        //Capturar formulario
        let data = req.body
        //Guardar info en DB
        let category = new Category(data)
        await category.save()
        //Responder
        return res.send({ message: `${category.name} correctly registered` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering category' })
    }
}

export const deleteC = async(req, res) => {
    try {
        //Obtener el Id
        let { id } = req.params
        //Validar si esta logeado y es el mismo
        //Eliminar (deleteOne / FindOneAndDelete)
        let deletedUser = await User.findOneAndDelete({_id: id})
        //Verificar que se elimino
        if(!deletedUser) return res.status(404).send({message: 'Account no found and not deleted'})
        //Responder
    return res.send({message: `Account with username ${deletedUser.username} deleted successfully`})        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting accout'})
    }
}

export const showsCategory = async (req, res) => {
    try {
        let results = await Category.find()
        if (!results) return res.status(400).send({ message: 'Empty colleection' })
        return res.send({ results })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Nothing to show' })
    }
}