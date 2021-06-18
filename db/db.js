const mongoose = require('mongoose')
require('dotenv').config();

async function connectDB(){
    console.log('trying to connect to db...')
    try{
        await mongoose.connect(`mongodb://akshayrajput:${process.env.DB_PASS}@wisp01-shard-00-00.6sufq.mongodb.net:27017,wisp01-shard-00-01.6sufq.mongodb.net:27017,wisp01-shard-00-02.6sufq.mongodb.net:27017/SocialApp?ssl=true&replicaSet=atlas-zdx3kh-shard-0&authSource=admin&retryWrites=true&w=majority`, {
        // await mongoose.connect(`mongodb+srv://akshayrajput:${process.env.DB_PASS}@wisp01.6sufq.mongodb.net/Inventory?ssl=true&replicaSet=atlas-zdx3kh-shard-0&authSource=admin&retryWrites=true&w=majority`, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })

        console.log('Connection successful')
    }
    catch(error){
        console.log('Error connecting to db: ', error)
    }
}

module.exports = { connectDB }