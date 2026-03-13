const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "static/build")));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TODO';
const PORT = process.env.PORT || 5000;

console.log('Connecting to MongoDB...', MONGODB_URI);
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

app.post('/add', (req, res) => {
  const { task } = req.body;
  TodoModel.create({ task })
      .then(result => res.json(result))
      .catch(err => console.log(err));
   
});

app.get('/get',(req,res)=>{
  TodoModel.find()
  .then(result=> res.json(result))
  .catch(err=>console.log(err));
});
  
app.put('/edit/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndUpdate(id,{done:true},{new:true})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.put('/update/:id',(req,res)=>{
  const{id} = req.params;
  const{task} = req.body;
  TodoModel.findByIdAndUpdate(id,{task:task})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.delete('/delete/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndDelete({_id:id})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 }); 

 app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static/build", "index.html"));
 });

module.exports=app;
