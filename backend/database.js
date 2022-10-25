const MongoClient = require('mongodb').MongoClient;
const COLLECTION_NAME = "users"

let db = null;

const mongoConnect = function (callback) {
    MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
        .then((client) => {
            db = client.db('restaurantUser')
            console.log("DB connection successful");
            callback();
        })
        .catch((error) => {
            console.log(error);
            throw new Error("DB connection failed....")
        })
}
exports.mongoConnect = mongoConnect;




//getting all the users 
exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).find().toArray()
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}


//Get user by uername
exports.getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).findOne({ email: username })
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}
//New user sign up
exports.addUsers = (user) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).insertOne(user)
            .then(res => resolve(res))
            .catch(err => reject(err));
    })
}


//Singing in 
exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).findOne({ "email": email })
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}


//Adding food
exports.addFoods = (user_id, food) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).updateOne({ email: user_id },
            { $push: { "foods": food } })
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

//updating food
exports.updateFoods = (email, origin, name, price, image) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).updateOne({ email: email, "foods.origin": origin },
            { $set: { "foods.$.name": name, "foods.$.price": price, "foods.$.image": image } })
            .then(res => resolve(res))
            .then(err => reject(err))
    })
}


//Getting all the foods
exports.getAllFoods = (email) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).findOne({ email: email })
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}
//Deleting food by Id
exports.deleteFood = (email, name, _id) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).updateOne({ email: email },
            { $pull: { foods: { 'name': name } } }
        )
            .then(res => resolve(res))
            .catch(err => reject)
    })
}


//Adding note
exports.addNotes = (email, note) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).updateOne({ email: email },
            { $push: { "notes": note } })
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}
//Getting all the notes
exports.getAllNotes = (email) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).findOne({ email: email })
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}

//Updating profile
exports.updatingProfile = (email, firstname, lastname, phone, address, password, comfirm_password) => {
    return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME).updateOne({ email: email },
            { $set: { "firstname": firstname, "lastname": lastname, "phone": phone, "address": address, "password": password, " comfirm_password": comfirm_password } })
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
}