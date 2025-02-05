
const { MongoClient, ServerApiVersion, Db } = require('mongodb');
require("dotenv").config();

const express = require("express")
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express();

// middleware 

app.use(cors())
app.use(express.json())


// start api create 


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS_WORD}@cluster0.vkfop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const Databse = client.db("ConnectToyouDB");
    const test = Databse.collection("test")

  













    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");









  }catch(error)
  {
    console.log(error);
  }
}
run().catch(console.log);












// server run 

// api test 
app.get('/', async (req,res)=>{
    res.send("server running")
})

app.listen(port , ()=>console.log(` server running on ${port} port`))


