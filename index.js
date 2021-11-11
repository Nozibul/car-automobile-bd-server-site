const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId ;

const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json())

// connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8uu4i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)


 
async function run() {
    try {
      await client.connect();
      const database = client.db("automobileDB");
      const productsCollection = database.collection("products");
      
      // get products api
      app.get('/products', async(req,res)=>{
        const cursor = productsCollection.find({})
        const product = await cursor.toArray()
        res.send(product) 
       
      })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('welcome my server')
  })
  
  app.listen(port, () => {
    console.log('Running port', port)
  })