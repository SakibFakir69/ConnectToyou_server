
const { MongoClient, ServerApiVersion, Db, ObjectId } = require('mongodb');
require("dotenv").config();

const express = require("express")
const cors = require('cors')

const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;
const app = express();

// middleware 

app.use(cors({
  origin: ["http://localhost:5173", "https://connecttoyou.netlify.app"]

}))
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


    const Databse = client.db("ConnectToyouDB");
    const test = Databse.collection("test");
    const userCollection = Databse.collection("users");
    const createPostCollection = Databse.collection("createPost");
    const newpostCollection = Databse.collection('newpostdata');
    const newsletterCollection = Databse.collection("newletters");

    const manageColelction = Databse.collection("managePost");



    // app.post("/login", async (req, res) => {

    //   const { Email } = req.body;
    //   console.log(Email)


    //   const token = jwt.sign({ Email: Email }, "faknsdmlaskdmn", {
    //     expiresIn: "24h"
    //   })

    //   res.send({ token });

    // })
    // app.post("/logout", async (req, res) => {

    // })













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

    // update user 


    app.put("/user-update/:email", async (req, res) => {

      const updateusesr = req.params.email;

      const {
        number,
        name
        ,
        gender
        ,
        fb
        ,
        email
        ,country
      } = req.body;


      const updateUser = {
        $set: {

          name: name,

          email: email,

          number: number,

          gender: gender,
          country: country,

          fb: fb





        }

      }
      const result = await userCollection.updateOne(updateUser, updateUser)
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

        const skip = (page - 1) * size;
        const search = req.query.PostName;
        const filter = search ? { PostName: { $regex: search, $options: 'i' } } : {};


        const result = await createPostCollection.find(filter).skip(skip).limit(size).toArray();

        const suffleresult = result.sort(() => Math.random() - 0.5);
        const countDocuments = await createPostCollection.countDocuments();

        res.send({ countDocuments, suffleresult });

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

        const result = await createPostCollection.find().sort({ Like: -1 }).limit(12).toArray();

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

    app.put('/new-details-page-user-follow/:Email', async (req, res) => {

      try {
        const Email = req.params.Email;


        const findEmail = await userCollection.findOne({ Email });
        if (findEmail) {
          const result = await userCollection.updateOne(findEmail, { $inc: { Follow: 1 } });
          console.log(result);

          res.send(result);
        }

        // find crate colelction by eamil







      } catch (error) {
        console.log(` this error come form user follow ${error.message}`)
      }



    })

    // top follwer



    // new account top 3 

    app.get('/new-account', async (req, res) => {

      try {
        const result = await userCollection.find().sort({ _id: -1 }).limit(8);
        res.send(result);

      } catch (error) {
        console.log(error.code);
      }


    })

    // incrase post 
    app.put('/count-post/:email', async (req, res) => {
      try {
        const email = req.params.email;

        console.log("Email received:", email);

        const findEmail = await userCollection.findOne({ Email: { $regex: new RegExp(`^${email}$`, "i") } });
        console.log(findEmail);



        if (findEmail) {
          const result = await userCollection.updateOne(
            findEmail,
            { $inc: { Post: 1 } },

          );

          console.log("Update result:", result);

          res.send(result);
        } else {
          res.send({ message: "User not found" });
        }
      } catch (error) {
        console.log("Error from count-post:", error);
        res.status(500).send({ error: error.message });
      }
    });
    app.get('/top-follwer', async (req, res) => {

      const result = await userCollection.find().sort({ Follow: -1 }).limit(6).toArray();
      res.send(result);
    })



    app.post('/newletters', async (req, res) => {

      try {
        const subscriber = req.body;

        const result = await newsletterCollection.insertOne(subscriber);
        res.send(result);

      } catch (error) {
        res.send("Errror founed on newsletter")
        console.log(error.message)
      }




    })



    // manage post

    app.get('/manage-post/:email', async (req, res) => {

      try {
        const Email = req.params.email;
        const result = await createPostCollection.find({ Email }).toArray();
        res.send(result);

      } catch (error) {
        res.status(404).send("not founeded")
      }



    })

    // delete manage post 

    app.delete('/manage-post-delete/:id', async (req, res) => {

      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await createPostCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {

        console.log("Error fecthed delete post", error.message)
      }


    })

    // put req

    app.put('/update-post/:id', async (req, res) => {

      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };

        const { Title, Message, Category, PostName, Image } = req.body;

        const updatePost = { Title, Message, Category, PostName, Image };

        const result = await createPostCollection.updateOne(filter, { $set: updatePost });
        res.send(result);


      } catch (error) {
        console.log("error form put mnage req", error.message)

      }



    })


































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


