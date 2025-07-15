const mongoose = require('mongoose')

const connectDB =async()=>{
    try {
        const conn =await mongoose.connect(process.env.Mongo_URL)
        console.log(`conected to database ${conn.connection.host}`);
    } catch (error) {
        
        console.log(`error${error}`)



    }
}

module.exports = connectDB;
