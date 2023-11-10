const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsq0j5x.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db('foodDB').collection('food')
    const foodRequestCollection = client.db('foodDB').collection('foodRequest')

    app.get('/food', async (req, res) => {
      const cursor = foodCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/food', async (req, res) => {
      const newFood = req.body
      const result = await foodCollection.insertOne(newFood)
      res.send(result)
    })

    app.put('/food/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateFood = req.body
      const updatedFood = {
        $set: {
          photo: updateFood.photo,
          name: updateFood.name,
          quantity: updateFood.quantity,
          quantity: updateFood.quantity,
          expiryDate: updateFood.expiryDate,
          details: updateFood.details,
          donarEmail: updateFood.donarEmail,
          donarName: updateFood.donarName,
          donarPhoto: updateFood.donarPhoto
        }
      }
      const result = await foodCollection.updateOne(filter, updatedFood, options)
      res.send(result)
    })

    app.get('/food/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.findOne(query)
      res.send(result)
    })

    app.delete('/food/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/request', async (req, res) => {
      const cursor = foodRequestCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/request', async (req, res) => {
      const newRequest = req.body
      const result = await foodRequestCollection.insertOne(newRequest)
      res.send(result)
    })

    app.delete('/request/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await foodRequestCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server is running on: ${port}`);
})