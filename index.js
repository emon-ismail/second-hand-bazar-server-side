
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
// middle wares
app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.twtll.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://bazar:SLsH0GJSCRuvTqeU@cluster0.ww1mwol.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)





async function run(){
try{
    const AllCategoriesCollection= client.db('bazar').collection('categories');
    const usersCollection = client.db('bazar').collection('users');
    const mobileCollection = client.db('bazar').collection('mobile_collection');

   const bookingsCollection = client.db('bazar').collection('bookings');

    app.get('/allcategories',async(req,res)=>{
        const query = {}
        const options= await AllCategoriesCollection.find(query).toArray();
        console.log(options)
        res.send(options)
    })
      

    app.get('/allcategories/:id', async (req, res) => {
        const id = req.params.id;
        const query = { category_id: id };

        const collections = await mobileCollection.find(query).toArray();
        res.send(collections);
        });







    app.get('/jwt', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        if (user) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            return res.send({ accessToken: token });
        }
        res.status(403).send({ accessToken: '' })
    });


    app.post('/users', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
    });

    app.get('/users', async (req, res) => {
        const query = {};
        const users = await usersCollection.find(query).toArray();
        res.send(users);
    });

    app.get('/users/admin/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isAdmin: user?.role === 'admin' });
    })







    app.put('/users/admin/:id',verifyJWT, async (req, res) => {
        const decodedEmail = req.decoded.email;
        const query = { email: decodedEmail };
        const user = await usersCollection.findOne(query);

        if (user?.role !== 'admin') {
            return res.status(403).send({ message: 'forbidden access' })
        }

        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                role: 'admin'
            }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options).toArray;
        res.send(result);
    })
    



    
}
finally{

}
}
run().catch(console.log)




        
    
    
    
          




app.get('/', (req, res) => {
    res.send('second hand bazar server running')
})

app.listen(port, () => {
    console.log(`second hand bazar server running ${port}`);
})



// app.put('/users/admin/:id', async (req, res) => {

//     const id=req.params.id;
//     const filter ={_id: ObjectId(id)}
//     const options={upsert: true}
//   const updateDoc={
//     $set:{
//         role:'admin'
//     }
//   }
//   const result = await usersCollection.updateOne(filter,updateDoc,options).toArray();
//   res.send(result)
//     }