const mongoose = require('mongoose');

const connectDB = async() =>{
    try{
        mongoose.set('strictQuery',false)
        //conncetion method
        const conn = await mongoose.connect(process.env.DATABASE)
        console.log(`connected to database: ${conn.connection.host}`)
    } 
        catch(e) {
            console.log(`error connecting to database: ${e.message}`)
    }
}

module.exports = connectDB