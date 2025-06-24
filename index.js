const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000
const app = express()
app.use(cors)
app.use(express.json())
app.listen(port)
require('dotenv').config()



const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gslw7jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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

        const collection = client.db("Move-Swift").collection("parcel")


        app.get("/parcel", async (req, res) => {
            const result = await collection.find().toArray();
            res.send(result);
        });


        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
