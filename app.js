import express from 'express';
import mongoose from 'mongoose';
import blogRouter from './routes/blog-routes.js';
import router from './routes/user-routes.js';
import cors from 'cors';
// require('dotenv').config();
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3080;
app.use(cors());
app.use(express.json()); //it will parse all of the data getting from the frontend end as the req.body to the applicaiton server into the json format which is applicable for the server to read

//user
app.use('/api/user', router); //http://localhost:3000/api/user

//blogs
app.use('/api/blog', blogRouter)


//serving the frontend as we have to host our application on the same url on the same hosting site
//static files reaching to our frontend

app.use(express.static(path.join(__dirname, './frontend/build')));
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
});

app.use('/api', (req, res, next)=>{
    res.send("Hello World");

})

 mongoose.connect(
      'mongodb+srv://admin:xhmXxEU9C7MVxmvf@cluster0.sifkbio.mongodb.net/Blog?retryWrites=true&w=majority'
      ).then(()=> app.listen(5000)).then(()=> console.log("Connected to the database")
      ).catch((err)=> console.log(err));




    app.listen(PORT, async () => {
      try {
        await connect();
        console.log(`Listening at ${PORT}`);
      } catch (e) {
        console.log(e.message);
      }
    });

