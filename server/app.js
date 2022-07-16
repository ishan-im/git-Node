const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();

//db

mongoose.connect(process.env.DATABASE_CLOUD)
        .then(()=>console.log('Databse connected'))
        .catch((err)=>console.log(err))



//routes

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const categoryRoutes = require('./routes/category')

const linkRoutes = require('./routes/link')

// app  middleware

app.use(morgan('dev'))

app.use(bodyParser.json({limit: '5mb', type:'applocation/json'}));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// app.use(cors())




app.use(cors({

        origin: process.env.CLIENT_URL
        
        }));


// routes

app.use('/api', authRoutes)

app.use('/api', userRoutes)

app.use('/api', categoryRoutes)

app.use('/api', linkRoutes)



//server


const port = process.env.PORT || 8080

app.listen(port,(req,res,next)=>{
    console.log(`API is running on port ${port}`);
})

