'use strict'

import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import  jwt  from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from './user.model.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) => {
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try {
        //Captturar el foormulario (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la informacion en a DB
        let user = new User(data)
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error registering user'})

    }
}

export const login = async(req, res) => {
    try {
        //Capturar los datos (body)
        let { username, password, email } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({
            $or:[
                {
                    username
                },
                {
                    email
                }
            ]
        }) //buscar un solo registro.
        //Verifico que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Generar Token
            let token = await generateJwt(loggedUser)
            //Responder al usuario
            return res.send({message: `Welcome ${loggedUser.name}`, loggedUser, token})
        }
        return res.status(404).send({message: 'Invalid credential'})
    } catch (error) {
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params;
        //Obtener secretkey
        let secretKey = process.env.SECRET_KEY
        //obtener el token 
        let { authorization } = req.headers
        let { uid } = jwt.verify(authorization, secretKey)
        if(id == uid){
        let data = req.body;
        let update = checkUpdate(data, id);
        if (!update) return res.status(400).send({ message: 'Have submit some data that cannot be update or missing data' })
        if (data.password) {
            if (!data.oldPassword) {
                return res.status(400).send({ message: 'The old password is request to update' })
            }
            const user = await User.findById(id);
            const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password)
            if (!isPasswordValid) {
                return res.status(401).send({ message: 'The previous password is incorrect' })
            }

            data.password = await encrypt(data.password)
        }

        let updateUser = await User.findOneAndUpdate(
            { _id: id }, 
            data, 
            { new: true } 
        );

        if (!updateUser) return res.status(401).send({ message: 'User not found and not updated' });
       
        return res.send({ message: 'Update user', updateUser });
    } else {
        return res.status(400).send({ message: 'It cannot be updated, it is not your user' })
    }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating the user' });
    }
};

export const createAdmin = async () => {
    try {
        let user = await User.findOne({ username: 'jnoj' });
        if (!user) {
            console.log('Creating admin...')
            let admin = new User({
                name: 'Josue',
                surname: 'Noj',
                username: 'jnoj',
                password: '12345',
                email: 'jnoj@kinal.org.gt',
                phone: '87654321',
            });
            admin.password = await encrypt(admin.password);
            await admin.save();
            return console.log({ message: `Registered successfully. Can be logged with username ${admin.username}` })
        }
        console.log({ message: `Can be logged with username ${user.username}` });

    } catch (err) {
        console.error(err);
        return err;
    }
}