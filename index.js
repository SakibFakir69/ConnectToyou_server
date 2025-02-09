
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
    // cd ConnectToyou_server
    // cd ConnectToyou_client
    await client.connect();

    const Databse = client.db("ConnectToyouDB");
    const test = Databse.collection("test");
    const userCollection = Databse.collection("users");
    const createPostCollection = Databse.collection("createPost");


    app.get('/test', async (req,res)=>{
      
      const result = await test.find().toArray();
      res.send(result);
    })


    // create user post request 

    app.post('/user-registation', async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);

    })
    // get user 

    app.get("/users", async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result);
    })


    // create post api 
    // 11:30
    // 11:40-12:30 next 
    // 12:40 -1:30 cp


    app.post('/create-post', async(req,res)=>{

      const users = req.body;
      const result = await createPostCollection.insertOne(users);
      res.send(result);



    })
    //get 

    //  this api go all post 
    // this api have email 
    // for founed post and perform CRUD opration

    /// use pagination and filter 
    app.get('/all-post', async(req,res)=>{
      
      try{
        const result = await createPostCollection.find().toArray();

        const suffleresult =result.sort(()=> Math.random()-0.5);

        res.send(suffleresult);
      }catch(error){
        console.log("this error founed on all data",error.name);
      }

    })
    

  













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


