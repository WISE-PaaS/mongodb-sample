const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const vcap_services = JSON.parse(process.env.VCAP_SERVICES);
const replicaSetName = vcap_services['mongodb-innoworks'][0].credentials.replicaSetName;
const db = vcap_services['mongodb-innoworks'][0].credentials.uri + '?replicaSet=' + replicaSetName;

// const db = 'mongodb://localhost/playground';

mongoose.connect(db)
  .then(() => console.log('Connected to the MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB...', err));

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  tags: [String],
  isPublished: Boolean
});

const Book = mongoose.model('Book', bookSchema);

app.get('/', (req, res) => {
  res.send('Hello WISE-PaaS!');
});

app.post('/api/book', (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    tags: req.body.tags,
    isPublished: req.body.isPublished
  });

  book.save();
  res.send(book);
});

const port = process.env.PORT || 3030;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
