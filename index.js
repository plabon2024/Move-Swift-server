const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())

require('dotenv').config()


app.get("/", (req, res) => {
    res.send("server running (. _ .)");
});
app.listen(port, () => {
});

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

        await client.connect();
        const collection = client.db("Move-Swift").collection("parcel")


        app.post("/parcel", async (req, res) => {
            try {
                const parcel = req.body;

                if (!parcel?.title || !parcel?.sender_name) {
                    return res.status(400).json({ message: "Missing required fields" });
                }

                const result = await collection.insertOne(parcel);
                res.status(201).json(result); 
            } catch (error) {
                console.error("Error inserting parcel:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

        app.get('/parcels', async (req, res) => {
            try {
                const userEmail = req.query.email;

                const query = userEmail ? { created_by: userEmail } : {};
                const options = {
                    sort: { createdAt: -1 }, // Newest first
                };

                const parcels = await collection.find(query, options).toArray();
                res.send(parcels);
            } catch (error) {
                console.error('Error fetching parcels:', error);
                res.status(500).send({ message: 'Failed to get parcels' });
            }
        });

        app.get("/parcel", async (req, res) => {
            const result = await collection.find().toArray();
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
