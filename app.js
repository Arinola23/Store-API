//setting up store environment variables
const express = require('express');
const app = express();
const port = process.env.PORT || 2011
require('dotenv').config()
const errorMiddleware = require('./middleware/error-handler-middleware')
const notFoundMiddleware = require('./middleware/not-found-middleware')
const connectDB = require('./db/db')
require('express-async-errors')
//connecting to database
connectDB()

//middleware for json
app.use(express.json())

// products route
const productsRouter = require('./routes/products.js')
app.use('/api/v1/products', productsRouter)
// app.get('/', (req, res) =>{
//     res.send('<h1> products</h1><a href="/api/v1/products">products route</a>');
// })

//middleware for products routes
app.use(errorMiddleware)
app.use(notFoundMiddleware)


const start = async () => {
    try{
        app.listen(port, () => {
            console.log(`app listening on ${port}`)
        })
    } catch(error){

    }
}
//invoking the server to run
start()
