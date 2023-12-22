const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      // "http://localhost:5173", "http://localhost:5000",
      "https://to-do-lists-1.web.app", "https://to-do-list-server-psi.vercel.app"
    ],
  })
);
app.use(express.json());

//to-do-list
//210OlKbBkyqvySlM

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.mowydsq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("taskDB").collection("tasks");
    const onGoingCollection = client.db("taskDB").collection("onGoings");
    const completeCollection = client.db("taskDB").collection("completes");

    app.get("/tasks/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/onGoings", async (req, res) => {
      const result = await onGoingCollection.find().toArray();
      res.send(result);
    });

    app.get("/completes", async (req, res) => {
      const result = await completeCollection.find().toArray();
      res.send(result);
    });

    app.post("/tasks", async (req, res) => {
      const user = req.body;
      const result = await taskCollection.insertOne(user);
      res.send(result);
    });

    app.post("/onGoings", async (req, res) => {
      const user = req.body;
      const result = await onGoingCollection.insertOne(user);
      res.send(result);
    });

    app.post("/completes", async (req, res) => {
      const user = req.body;
      const result = await completeCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/onGoings/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await onGoingCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/completes/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await completeCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateTasks = {
        $set: {
          title: task.title,
          priority: task.priority,
          description: task.description,
          deadline: task.deadline,
        },
      };
      const result = await taskCollection.updateOne(query, updateTasks, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Client!");
});
app.listen(port, (req, res) => {
  console.log(`Brand Shop is Running at ${port}`);
});
