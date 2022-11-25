
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

    app.get('/allcategories',async(req,res)=>{
        const query = {}
        const options= await AllCategoriesCollection.find(query).toArray();
        console.log(options)
        res.send(options)
    })

    app.get('/allcategories/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const options = await AllCategoriesCollection.findOne(query);
        res.send(options);
    });

    app.post('/users', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
    });
    


    
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