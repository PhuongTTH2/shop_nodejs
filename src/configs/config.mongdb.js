'use strict'
//0
// const config ={
//     app:{

//     },
//     db:{
//         host:'127.0.0.1',
//         name:"PhuongDev",
//         port:"27017"
//     }
// }
// module.exports = config
//1
const dev ={
    app:{

    },
    db:{
        host:process.env.HOST_DEV || '127.0.0.1',
        name:process.env.NAME_DEV || 'PhuongDev',
        port:process.env.PORT_DEV || 27017
    }
}
const prod ={
    app:{

    },
    db:{
        host:process.env.HOST_PROD,
        name:process.env.NAME_PROD,
        port:process.env.PORT_PROD
    }
}
const config = { dev, prod }

const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]