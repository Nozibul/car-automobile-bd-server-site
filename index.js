const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId ;

// middleware
app.use(cors());
app.use(express.json())

// connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8uu4i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
 
async function run() {
    try {
      await client.connect();
       console.log('database connect')
      const database = client.db("automobileDB");
      const productsCollection = database.collection("products");
      const orderCollection = database.collection("orders");
      
      // get products api
      app.get('/products', async(req,res)=>{
        const cursor = productsCollection.find({})
        const product = await cursor.toArray()
        res.send(product) 
       
      })

      // order post api
      app.post('/order', async(req, res)=>{
        const orders = req.body;
        // console.log(orders)
        const result = await orderCollection.insertOne(orders);
        res.json(result)
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