//back-end
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { query } = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

//middle ware : 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster1.wjwlqun.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

  try {

    await client.connect();
    const carCollection = client.db('carshop').collection('ourcar');



    // service api
    app.get('/ourcar', async (req, res) => {
      const query = {};
      const cursor = carCollection.find(query);
      const ourcar = await cursor.toArray();
      res.send(ourcar);
    });


  // get one items with id no :
    app.get('/ourcar/:id', async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: ObjectId(id) };
      const ourcar = await carCollection.findOne(query);
      res.send(ourcar);
    });



    //product counte api:



    // app.get('/productCount',async(req,res)=>{

    //   const query = {};
    //   const cursor = carCollection.find(query);
    //   const count = await cursor.count();
    //   res.json(count);

    // })



    // My order :
    /// get my all order my email
    
    
    app.get('/orders', async (req, res) => {
      let email = req.query.email;
      if (email) {
        // console.log('outside decodedddd', email);
        const query = {email};
        const cursor = carCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);

      }else {
        console.log("invalid Email");
        res.status(403).send({ message: 'forbidden access' });
      }

    });


    // add items:
    app.post('/ourcar', async (req, res) => {
      const newService = req.body;
      console.log('data recive:', newService);
      const result = await carCollection.insertOne(newService);
      res.send(result);

    });


    // quentity update:
    app.put("/ourcar/:id", async (req, res) => {
      const id = req.params.id;
      const newCars = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateCar = {
        $set: {
          quantity: newCars.quantity,
        },
      };
      const result = await carCollection.updateOne(filter, updateCar, options);
      res.send(result);
    });


    //quentity decrease try :  copy
    //   app.put("/ourcar/:id", async (req, res) => {
    //     const id = req.params.id;
    //      const newCars = req.body;
    //      console.log(newCars);
    //     const filter = { _id: ObjectId(id) };
    //     const options = { upsert: true };
    //     const updateCar = {
    //       $inc : {
    //         quantity: - 1,
    //       }
    //   }

    //   const result = await carCollection.updateOne(filter, options, updateCar);
    //   res.send(result);
    // });



    // //quentity decrease :
    
    
    app.put("/ourcar/:id", async (req, res) => {
      const id = req.params.id;
      const newCars = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateCar = {
        $set: {
          quantity: newCars.quantity,
        },
      };
      const result = await carCollection.updateOne(filter, updateCar, options);
      res.send(result);
    });

    db.products.updateOne(
      { sku: "abc123" },
      { $inc: { quantity: -2, "metrics.orders": 1 } }
    )

    // app.deleteOne( { status: "D" } )
 

    // // // Manage product delete api :
    app.delete('/ourcar/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await carCollection.deleteOne(query);
      // console.log(result)
      res.send(result);
    });
    

  
    // app.delete('/ourcar/delete/:id', async (req, res) => {
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = { _id: ObjectId(id) };
    //   const result = await carCollection.deleteOne(query);
    //   res.send(result);
    // });


  }
  finally {

  }

}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Start sarver port ${port}`)
})
