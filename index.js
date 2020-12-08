const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;

require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9na52.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const port = 5000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  
  const organizationCollection = client.db(`${process.env.DB_NAME}`).collection("organizations");
  const userCollection = client.db(`${process.env.DB_NAME}`).collection("users");
  
  app.post('/addOrganization', (req, res) => {
      const organization = req.body;
      console.log(organization)
      organizationCollection.insertOne(organization)
      .then(result => {
        console.log(result);
        res.send(result)
      console.log(organization)
    })
  })

  

  app.get('/organizations', (req, res) => {
    const select = req.query.search
    organizationCollection.find({name : {$regex : select }})
    .toArray((err, documents) => {
      console.log(documents)
        res.send(documents);
        
    })
  })

  app.get('/organizations/:id', (req, res) => {
    organizationCollection.find({id: req.params.id})
    .toArray((err,documents) => {
        res.send(documents[0]);
    })
  })

  app.post('/addorg', (req, res) => {
    const userInfo = req.body;
    console.log(userInfo)
    userCollection.insertOne(userInfo)
  
    .then(result => {
      res.send(result);
    })
  })

  app.get('/userorg', (req, res) => {
    userCollection.find({email : req.query.email})
    .toArray((err, documents)=>{
      res.send(documents)
    })

  })

  app.get('/admin', (req, res) => {
    userCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents)
    })

  })

  app.delete(`/delete/:id`, (req, res) =>{
    console.log(ObjectId(req.params.id))
    userCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then (result => {
       res.send(result.deletedCount > 0)
       console.log(result)
    })
})
});


app.get('/', (req, res) => {
  res.send('welcome to server of volunteer network')
})



app.listen(process.env.PORT || port)
