const { SkipPreviousOutlined } = require('@material-ui/icons')
const Product = require('../model/product')
 const asyncHandler = require('express-async-handler')

 //the general search
 const getAllProductsStatic =asyncHandler(async(req,res) =>{
    const products = await Product.find({name:'timelin'})
    res.status(200).json({products, nbHits: products.length})
    // try{
    //     const product = await Product.find()
    //     if(!product) {
    //         return res.status(404).json('Product not found')
    //     }
    //     res.send('testing')
    //     res.status(200).json({product:product})
    //     // res.send('testing2')
    // } catch(e){
    //     res.status(500).json('server error')
    // }
})

 const getAllProducts = asyncHandler(async(req,res) =>{
    //to find properties without passing directly to .find
    //this helps to define and assist users to search for products true name, price etc
    //adding properties in the query string parameters
    const {featured, company, name, sort, fields, numericFilters } = req.query
    //the create a new object to store the data of the interested properties
    const queryObject = {}
    
    if(featured){
            // returns all the featured both true and false
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company){
        queryObject.company = company
    }

    if(name) {
        //used to search for name case insensitive. regex and option must be used together
        queryObject.name = {$regex: name,  $options: 'i'}
    }

    //numericfilters
    if(numericFilters) {
        const operatorMap = {
            '<' : "$lt", '<=': '$lte','>' : "$gt", '>=':"$gte", "=": "$eq" 
        }
        const reqEx = /\b(<|>|>=|<=|=)\b/g
        let filters = numericFilters.replace(reqEx, (match) => `-${operatorMap[match]}-`)
        const options = ['price','rating']
        filters = filters.split(',').forEach((item)=>{
            const [field, operator, value] =item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
        // console.log(filter)
    }
    
    console.log(queryObject)
    let result = Product.find(queryObject) //the .sort.seelect etc all comes after the .find

    //sort sorts, in an ascending or descending order by adding - to the desired property, e.g -name
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else{
        result = result.sort('createAt')
    }

    //field, the field is used to select the desired properties e.g name, company
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10 //limit determines the number of products on each pages, 10 products will be on 2 pages each, 3 producst on the 3rd page and 7 products will be on 3 pages each and 2 products on the 4th page.
    const skip = (page - 1) * limit
    
    result = result.skip(skip).limit(limit) //skip to the next page and also the limit i.e the number of products on each page.
//if the product is 23, and they are 4 pages, the the products are divided into 4
//lets say 7 7 7 2, so the default page number is 1 containing 7 products, when the user clicks on the next page,
//the exixting page 1 is substracted by 1 and mutiplied by the limit 1, it skips to the next page
    const products = await result
    res.status(200).json({products, nbHits:products.length })
    
    
    // try{
//     const product = await Product.find({})
//     if(!product) {
//         return res.status(404).json('Product not found')
//     }
//     res.status(200).json({product:product})
//     // res.send('testting1')
// } catch(e){
//     res.status(500).json('server error')
// }
})


module.exports = {getAllProducts, getAllProductsStatic}
