const todosRouter = require('express').Router();
const todo = require('../models/todo');

// rutas protegidaas para saber si existe y tiene acceso
todosRouter.post('/', async (request, response) =>{
    const user = request.user;
    if (!user) {
        return response.sendStatus(401);
    }

    const { text, number } = request.body;
    if(!text && !number){
        return response.sendStatus(400).json({ error: 'El texto es requerido' });
    }

    // const todos = await todo.findOne({ text });

    // buscar si el contacto ya existe
    // if(todos) {
    //     return response.status(400).json({ error: 'El contacto ya existe' });
    // }

    const newTodo = new todo({
        text,
        number,
        user: user._id
    });
    // console.log(newTodo);
    const savedTodo = await newTodo.save();

    user.todos = user.todos.concat(savedTodo._id);

    return response.status(201).json(savedTodo)
});

// extraer las tareas de la base de datos del usuario
todosRouter.get('/', async (request, response) =>{
    const user = request.user;
    if (!user) {
        return response.sendStatus(401);
    }

    const todos = await todo.find({user: user.id});
    // enviar las tareas al frontend
    return response.status(200).json(todos);

});

// eliminar las tareas en la base de dato y en el frontend
todosRouter.delete('/:id', async (request, response) =>{
    const user = request.user;
    if (!user) {
        return response.sendStatus(401);
    }

    await todo.findByIdAndDelete(request.params.id);
    return response.sendStatus(204);
});

// Actualizar en la base de datos
todosRouter.patch('/:id', async (request, response) =>{
    const user = request.user;
    if (!user) {
        return response.sendStatus(401);
    }
    const { text, number } = request.body;

    await todo.findByIdAndUpdate(request.params.id, { text, number });

    return response.sendStatus(200);
});

module.exports = todosRouter;