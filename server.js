const app = require("./src/app");
require('dotenv').config
const PORT = process.env.PORT || 3055
console.log('process.env.PORT', process.env)
console.log('process.env.PORT', process.env.PORT)
const server = app.listen(PORT, () =>{
    console.log(`Phuong eCommerce: ${PORT}`)
})

process.on('SIGINT',() =>{
    server.close(() => console.log(`Exit server`))
   
})