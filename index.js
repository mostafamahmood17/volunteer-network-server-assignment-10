const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9na52.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 5000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const organizationCollection = client.db(`${process.env.DB_NAME}`).collection("organizations");
  app.post('/addOrganization', (req, res) => {
      const organization = req.body;
      organizationCollection.insertOne(organization)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount)
    })
  })

  app.get('/organizations', (req, res) => {
    organizationCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })

  app.get('/organizations/:id', (req, res) => {
    organizationCollection.find({id: req.params.id})
    .toArray((err,documents) => {
        res.send(documents[0]);
    })
  })
});


app.get('/', (req, res) => {
  res.send('welcome to server of volunteer network')
})



app.listen(port)