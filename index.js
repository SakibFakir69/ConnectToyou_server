
const { MongoClient, ServerApiVersion, Db, ObjectId } = require('mongodb');
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
    const newpostCollection = Databse.collection('newpostdata');


    app.get('/test', async (req, res) => {

      const result = await test.find().toArray();
      res.send(result);
    })


    // create user post request 

    app.post('/user-registation', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);

    })
    // get user 

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })


    // create post api 
    // 11:30
    // 11:40-12:30 next 
    // 12:40 -1:30 cp


    app.post('/create-post', async (req, res) => {

      const users = req.body;
      const result = await createPostCollection.insertOne(users);
      res.send(result);



    })
    //get 

    //  this api go all post 
    // this api have email 
    // for founed post and perform CRUD opration

    /// use pagination and filter 
    app.get('/all-post', async (req, res) => {


      try {

        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 6;

        const skip = (page-1)*size;
        const search = req.query.PostName;
        const filter =search ?  { PostName:{$regex:search,$options:'i'}} : {}; 


        const result = await createPostCollection.find(filter).skip(skip).limit(size).toArray();

        const suffleresult = result.sort(() => Math.random() - 0.5);
        const countDocuments = await createPostCollection.countDocuments();

        res.send({countDocuments,suffleresult});

      } catch (error) {
        console.log("this error founed on all data", error.name);
      }

    })


    // new 20 data 

    // make new post show latest 20 data 

    app.get('/new-post', async (req, res) => {
      /// new data new collection 


      try {

        const result = await createPostCollection.find().sort({ _id: -1 }).limit(6).toArray();

        res.send(result);

      }
      catch (error) {
        console.log(error.messgae);
      }

    })

    /// post complemen under 30 word or length



    //// Trending post 


    app.get('/trending-post', async (req, res) => {

      try {

        const result = await createPostCollection.find().sort({Like:-1}).limit(12).toArray();

        res.send({ message: "data send", result });

      } catch (error) {
        console.log(`this error founded on ${error.message}`)
      }



    })


    // all user 


    // user search by name 

    app.get('/all-user', async (req, res) => {


      try {


        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 6;

        const Name = req.query.Name;

        const filter = { Name: { $regex: Name, $options: "i" } }




        const totalUsers = await userCollection.countDocuments();


        const result = await userCollection.find(filter).skip(page - 1).limit(size).toArray();

        res.send({ count: totalUsers, result });


      } catch (error) {
        console.log(`find error on all user ${error.message}`)
        res.status(500).send({ error: "server error" })
      }





    })

    // details page opration

    /// all post 

    app.get('/details-post/:id', async (req, res) => {
      const id = req.params.id;

      const filter = { _id: new ObjectId(id) };

      const result = await createPostCollection.find(filter).toArray();
      res.send(result);

    })

    // liked

    app.put('/new-details-post/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };


      try {

        const result = await createPostCollection.updateOne(query, { $inc: { Like: 1 } });
        res.send(result);

      } catch (error) {
        console.log(error.name);
      }



    })

    // liked decrement 


    app.put('/new-details-post-unlike/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };


      try {

        const result = await createPostCollection.updateOne(query, { $inc: { UnLike: 1 } });
        res.send(result);

      } catch (error) {
        console.log(error.name);
      }



    })




    // follow post


    app.put('/new-details-post-follow/:id', async (req, res) => {

      try {
        const id = req.params.id;
        const qury = { _id: new ObjectId(id) };

        const result = await createPostCollection.updateOne(qury, { $inc: { FollowPost: 1 } })
        res.send(result);
      } catch (error) {
        console.log(` this error from follow post`, error.name);
      }
    })
    // user follow 

    app.put('/new-details-page-user-follow/:id', async (req, res) => {

      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };

        const result = await userCollection.updateOne(filter, { $inc: { Follow: 1 } })

        res.send(result);

      } catch (error) {
        console.log(` this error come form user follow ${error.message}`)
      }



    })

    // top follwer

    app.get('/top-follwer',async (req,res)=>{

      const result = await userCollection.find().sort({Follow:-1}).toArray();
      res.send(result);
    })


    // new account top 3 

    app.get('/new-account', async(req,res)=>{

      try{
        const result = await userCollection.find().sort({_id:-1}).limit(3);
        res.send(result);

      }catch(error)
      {
        console.log(error.code);
      }

    
    })

    
















    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");









  } catch (error) {
    console.log(error);
  }
}
run().catch(console.log);












// server run 

// api test 
app.get('/', async (req, res) => {
  res.send("server running")
})

app.listen(port, () => console.log(` server running on ${port} port`))


