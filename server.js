const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname));

mongoose.connect('mongodb://localhost:27017/student');

const connect = mongoose.connection;

connect.on('error', console.error.bind(console, 'MongoDB connection error:'));

connect.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    age : Number
});

const User = mongoose.model('User', userSchema);

app.get('/', async (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.post('/users', async (request, response) => {
    const user = new User({
        name : request.body.name,
        email : request.body.email,
        age : request.body.age
    });
    const newItem = await user.save();
    response.status(201).json({scuccess:true});
});

app.get('/users', async (request, response) => {
    const users = await User.find();
    response.status(200).json(users);
});

app.get('/users/:id', async (request, response) => {
    const user = await User.findById(request.params.id);
    response.status(200).json(user);
});

app.put('/users/:id', async (request, response) => {
    const userId = request.params.id;
    const user = await User.findById(userId);
    user.name = request.body.name;
    user.email = request.body.email;
    user.age = request.body.age;
    const updatedItem = await user.save();
    response.status(200).json(updatedItem);
});

app.delete('/users/:id', async (request, response) => {
    const userId = request.params.id;
    const user = await User.findById(userId);
    await user.deleteOne();
    response.status(200).json({ message : 'Deleted item' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});