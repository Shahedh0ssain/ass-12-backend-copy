
//back-end
//const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster1.wjwlqun.mongodb.net/?retryWrites=true&w=majority`;



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');

//project-car
//mHnTJCZufN9cBqQi

const port = process.env.PORT || 5000;

//middle ware :
app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://project-car:mHnTJCZufN9cBqQi@cluster1.wjwlqun.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster1.wjwlqun.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//middle function:
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(' ')[1];
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorization' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    });



}


async function run() {
    await client.connect();
    const carCollection = client.db('carshop').collection('ourcar');
    const userCollection = client.db('carshop').collection('user');

    try {


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
            const query = { _id:ObjectId(id) };
            const ourcar = await carCollection.findOne(query);
            res.send(ourcar);
        });


        //my orders
        app.get('/orders', verifyJWT, async (req, res) => {
            let email = req.query.email;
            const decodedEmail = req.decoded.email;
            // console.log('outide jwt token', req.decoded);

            if (email === decodedEmail) {
                const query = { email };
                const cursor = carCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);

            } else {
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

        // user api
        // app.put('/user/:email', async(req,res)=>{
        //     const email = req.query.email;
        //     console.log(email);
        //     const user = req.body;
        //     // const filter = {email:email}
        //     // const options = {upsert:true}
        //     // const updateDoc = {
        //     //     $set:user,
        //     // };
        //     // const result = await userCollection.updateOne(filter,updateDoc,options);
        //     // const token = jwt.sign({email:email }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' });
        //     // res.send(result,token);
        // })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            console.log(token);
            res.send({ result, accessToken: token });

        })

        //delete api
        app.delete('/ourcar/delete/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await carCollection.deleteOne(query);
            // console.log(result)
            res.send(result);
        });

        
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Worldddddd!')
})


app.listen(port, () => {
    console.log(`Start sarver port ${port}`)
})


