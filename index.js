import express from 'express';


import contactRoute from './routes/contactRoute.js';
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js';
dotenv.config()

const app = express();

app.use(express.json());

const PORT = 5555 || process.env.PORT 

app.get("/",(request,response)=>{
  response.json({
       message : "Server is running " + PORT
   })
})

app.use('/contact', contactRoute);

connectDB().then(()=>{
  app.listen(PORT,()=>{
      console.log("Server is running",PORT)
  })
})