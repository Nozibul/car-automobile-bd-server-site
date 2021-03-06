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

 
async function run() {
    try {
      await client.connect();
       console.log('database connect')
      const database = client.db("automobileDB");
      const productsCollection = database.collection("products");
      const orderCollection = database.collection("orders");
      const usersCollection = database.collection("users");
      const reviewCollection = database.collection("reviews");
      const commentCollection = database.collection("comment");
      
      // get products api
      app.get('/products', async(req,res)=>{
        const cursor = productsCollection.find({})
        const product = await cursor.toArray()
        res.send(product) 
       
      })

      // get api for all order
      app.get('/orders', async(req, res)=>{
        const cursor = orderCollection.find({})
        const orders = await cursor.toArray()
        res.send(orders)
      })


      // get api for specific user orders
      app.get('/order', async(req, res)=>{
        const email = req.query.email ;
        const query = {email: email}
        const cursor = orderCollection.find(query)
        const order = await cursor.toArray()
        res.json(order)
      }) 

      // order post api
      app.post('/order', async(req, res)=>{
        const orders = req.body;
        const result = await orderCollection.insertOne(orders);
        res.json(result)
      })


      // delete order of specific user
      app.delete('/deleteOrder/:id', async(req,res)=>{
         const id = req.params.id ;
         const query = {_id: ObjectId(id)}
         const deleteOrder = await orderCollection.deleteOne(query)
         res.json(deleteOrder)
        })

   // delete order for all users
  //  app.delete('/orders/:id', async(req,res)=>{
  //   const id = req.params.id ;
  //   const query = {_id: ObjectId(id)}
  //   const deleteOrders = await productsCollection.deleteOne(query)
  //   console.log(deleteOrders)
  //   res.json(deleteOrders)
  //  })


      // delete product
      app.delete('/products/:id', async(req,res)=>{
         const id = req.params.id ;
         const query = {_id: ObjectId(id)}
         const deleteProduct = await productsCollection.deleteOne(query)
         console.log(deleteProduct)
         res.json(deleteProduct)
        })


      // save user to database
      app.post('/users', async(req, res)=>{
          const users = req.body ;
          const user = await usersCollection.insertOne(users)
          res.json(user)
      })


      // review data add to database
      app.post("/review", async (req, res) => {
        const review = req.body;
        const reviews = await reviewCollection.insertOne(review);
        res.json(reviews);
      });


        // get api  for review
        app.get('/review', async(req,res)=>{
          const cursor = reviewCollection.find({})
          const review = await cursor.toArray()
          res.send(review) 
         
        })
  

        // post api for comment 
        app.post('/comment', async (req, res) => {
          const comment = req.body;
          const comments = await commentCollection.insertOne(comment);
          res.json(comments);
        });
   
          // get api  for comment
        app.get('/comment', async(req,res)=>{
          const cursor = commentCollection.find({})
          const comment = await cursor.toArray()
          res.send(comment) 
         
        })


    // add product admin     
    app.post('/products', async(req, res)=>{
        const product = req.body;
        const result = await productsCollection.insertOne(product);
        res.json(result)
      })
  








    //
    app.put('/users', async(req,res)=>{
      const user = req.body;
      const filter = {email: user.email};
      const options = {upsert: true}
      const updateDoc = { $set: user};
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })


    // check admin
    app.get('/users/:email', async(req, res)=>{
      const email = req.params.email ;
      const query = {email: email};
      const user = await usersCollection.findOne(query)
      let isAdmin = false ;
      if(user?.role === 'admin'){
        isAdmin = true ;
      }
      res.json({admin: isAdmin})
    })


  // put api for add admin

   app.put('/users/admin', async(req, res)=>{
     const user = req.body;
     console.log(user)
     const filter = {email: user.email};
     const updateDoc = { $set: {role: 'admin'}}
     const result = await usersCollection.updateOne(filter, updateDoc)
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
    console.log('Running server port', port)
  })