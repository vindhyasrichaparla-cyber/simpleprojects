const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Contact = require('./models/Contact');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/contactbook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get('/api/contacts', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.post('/api/contacts', async (req, res) => {
  const { name, phone, email } = req.body;
  const contact = new Contact({ name, phone, email });
  await contact.save();
  res.json(contact);
});

app.put('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    id,
    { name, phone, email },
    { new: true }
  );
  res.json(contact);
});

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  await Contact.findByIdAndDelete(id);
  res.json({ message: 'Contact deleted' });
});

app.get('/api/contacts/search/:name', async (req, res) => {
  const { name } = req.params;
  const contacts = await Contact.find({ name: new RegExp(name, 'i') });
  res.json(contacts);
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
