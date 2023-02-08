const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: String,
    number: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 
});

todoSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;