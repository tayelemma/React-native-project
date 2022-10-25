const mongoConnect = require('./database').mongoConnect;
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./database');
const SECRET_KEY = "this is key";
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res, next) => {
    res.send("Hello ")
})



////////// SIGN IN ////////////////////////
app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const exist = await db.getUserByEmail(email);
        if (exist) {
            console.log(exist);
            if (bcrypt.compareSync(password, exist.password)) {
                const token = jwt.sign(
                    { email },
                    SECRET_KEY,
                    { expiresIn: 60 * 60 }
                )
                res.send({ success: 1, data: { token, exist } })
            } else {
                res.send({ success: 0, error: "Wrong Password" })
            }
        } else {
            res.send({ success: 0, error: "Wrong email" })
        }
    } catch (error) {
        res.send({ success: 0, error: "Login Error" })
    }
})




////////// NEW USER SIGN-UP //////////////////
app.post('/users/register', async (req, res) => {
    try {
        const user = req.body;
        const exist = await db.getUserByEmail(user.email);
        if (exist) {
            res.send({ success: 0, error: "The Email exist, please try another." })
            return;
        }
        user.password = bcrypt.hashSync(user.password, 10);
        const response = await db.addUsers(user);
        res.send(response)

    } catch (error) {
        res.send({ success: 0, error: "Adding user Error" })
    }
})




///////// AUTHORIZATION ///////////////////
function authorize(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (error, data) => {
            if (error) {
                res.send({ success: 0, error: " Wrong Token" })
                return;
            }
            next();
        })
    } else {
        res.send({ success: 0, error: "Require a token " })
    }
}
////////////GET ALL USERS ///////////////////////
app.get('/users', async (req, res) => {
    try {
        const response = await db.getAllUsers();
        res.send({ success: 1, data: response })
    } catch (error) {
        res.send({ success: 0, error: "Getting users fail" })
    }
})

//Get a specific user
app.get('/users/:username/user', async (req, res) => {
    try {
        const username = req.params.username;
        const response = await db.getUserByUsername(username);
        res.send(response);
    } catch (err) {
        res.send(err);
    }
})



//Adding new food
app.put('/users/:email/foods/', async (req, res) => {
    try {
        const email = req.params.email;
        const food = req.body;
        food._id = ObjectId();
        food.date = new Date();
        const response = await db.addFoods(email, food)
        res.send(response);

    } catch (error) {
        res.send({ success: 0, error: "Fail to add food" })
    }
})



//Updating existing food
app.patch('/users/:email/foods/:origin', async (req, res) => {
    try {
        const email = req.params.email;
        const origin = req.params.origin;
        const { name, price, image } = req.body;
        const response = await db.updateFoods(email, origin, name, price, image);
        res.send(response)
    } catch (error) {
        res.send({ success: 0, error: "Failed to update foods." })
    }
})



//Getting all the foods
app.get('/users/:email/foods/', async (req, res) => {
    try {
        const email = req.params.email;
        const response = await db.getAllFoods(email);
        res.send(response)
    } catch (err) {
        res.send(err);
    }
})



//Deleting food by _id
app.delete('/users/:email/foods/:name', async (req, res) => {
    try {
        console.log("Testing .............")
        const email = req.params.email;
        const _id = ObjectId(req.params._id);
        const name = req.params.name;
        const response = await db.deleteFood(email, name, _id);
        console.log(email, _id)
        res.send(response);
    } catch (err) {
        res.send(err);
    }
})


//Adding notes
app.put('/users/:email/notes', async (req, res) => {
    try {
        const email = req.params.email;
        const note = req.body;
        note._id = ObjectId();
        note.date = new Date();
        const response = await db.addNotes(email, note)
        res.send(response);
    } catch (err) {
        res.send(err);
    }
})


//Getting notes
app.get('/users/:email/notes', async (req, res) => {
    try {
        const email = req.params.email;
        const response = await db.getAllNotes(email);
        res.send(response);
    } catch (err) {
        res.send(err);
    }
})


//Editing profile 
app.patch('/users/:email/profile', authorize, async (req, res) => {
    try {
        const email = req.params.email;
        const { firstname, lastname, phone, address, password, comfirm_password } = req.body;
        password = bcrypt.hashSync(password, 10);
        comfirm_password = bcrypt.hashSync(comfirm_password, 10);
        const response = await db.updatingProfile(email, firstname, lastname, phone, address, password, comfirm_password);
        res.send(response)
    } catch (error) {
        res.send({ success: 0, error: "Failed to update foods." })
    }
})



mongoConnect(() => {
    app.listen(3000, () => console.log("Lisning to port 3000..."))
})