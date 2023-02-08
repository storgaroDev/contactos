const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { PAGE_URL } = require('../config.js')


userRouter.post('/', async (request, response) =>{
    const {name, email, password} = request.body;

    //Buscar si el email ya esta regsitrado
    const user = await User.findOne({ email });

    //Buscar si usuario existe
    if (user) {
        return response.status(400).json({ error: 'email ya se encuentra en uso' });
    }

    //
    if (!(name && email && password)) {
        return response.status(400).json({ error: 'todos los campos son requeridos' })
    }

    // Encriptar contraseña
    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Crear usuario en la base de datos 
    const newUser = new User({
        name,
        email,
        passwordHash,
    });

    // Guardar el modelo/usuario
    const savedUser = await newUser.save();

    // Mandar el correo de verificacion
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: process.env.NODE_ENV === 'production'
        ? 465
        : 587,

        secure: process.env.NODE_ENV === 'production'
        ? true
        : false,
        auth: {
          user: process.env.EMAIL_USER, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      });
      
      // crear token para la verificacion de email
      const userForToken = {
      email,
      id: savedUser.id
    }
  
  const verifyToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});

        await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: savedUser.email, // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello', // plain text body
        html:`<a href="${PAGE_URL}verify/${savedUser.id}/${verifyToken}">Verificar correo</a>`, // html body
      });
    


    return response.status(201).json(savedUser);
});

userRouter.patch('/:id/:token', async (request, response) =>{

  //Buscar si el email ya esta regsitrado
  const user = await User.findById(request.params.id);

  //Buscar si usuario existe
  if (!user) {
      return response.status(400).json({ error: 'El usuario no existe' });
  }

  const decodedToken = jwt.verify(request.params.token, process.env.ACCESS_TOKEN_SECRET);

  if (!decodedToken) {
    await User.findByIdAndDelete(request.params.id);
   return response.status(201).json(false);
  }

  await User.findByIdAndUpdate(request.params.id, { verify:true });

  return response.status(201).json(true);
});

module.exports = userRouter;