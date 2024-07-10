require('dotenv').config()

const connectDB = require('./db/db')
const Product = require('./model/product')

const jsonProduct = require('./product.json')

//to start the populate server we connect it to the database
const start = async () => {
    try {
        await connectDB(process.env.DATABASE)
        //to delete any existing data in the database
        await Product.deleteMany()
        await Product.create(jsonProduct)
        console.log('first connection')
        process.exit(0)
    } catch (err) {
        console.log(err)
        process.exit(1)
        }
}
 start()