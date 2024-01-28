'use strict'

const { default: mongoose } = require("mongoose")
const os = require('os')
const process = require('process')
const _SECONDS = 5000

const countConnect = () =>{
    const numConnection = mongoose.connections.length
    console.log(`Number connecttion:: ${numConnection}`)
}

const checkOverload = () =>{
    setInterval( () =>{
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConnection= numCores* 5;

        console.log(`Memory use:: ${memoryUsage / 1024 / 1024} MB`)
        if( numConnection > maxConnection ) {
            console.log('Connection overload')
        }
    },_SECONDS) // every 5s
}
module.exports = {
    countConnect,
    checkOverload
}