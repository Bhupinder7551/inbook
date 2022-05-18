const express = require('express')
const connectToDb = require('./db');

connectToDb();
const app = express()
const port = 5000;


app.use(express.json())

app.use('/api/', require('./routes/route_admin'))
 

app.listen(port,()=>{
    console.log(`newbackend listening at http://localhost:${port}`)
})