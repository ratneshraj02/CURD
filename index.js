import express from 'express';

import logger from './logger.js';
import morgan from 'morgan';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json()); // it is accept json data from frontend side

//small middleware

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


// Tea array 
let teaData = [];
let nextId = 1;

//add a new tea
app.post('/teas', (req, res) => {
    const {name, price} = req.body;
    const newTea = {id:nextId++, name, price};
    teaData.push(newTea);
    res.status(201).send(newTea);
});

//get all tea
app.get('/teas', (req, res) => {
    res.status(200).send(teaData);
});

//get a tea with id.
app.get('/teas/:id', (req, res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id));

    if(!tea) {
        return res.status(404).send("Tea not found");
    }
    res.status(200).send(tea); 
});

//updation of tea
app.put('/teas/:id', (req, res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id));

    if(!tea){
        res.status(404).send("Tea no found");
    }

    const {name, price} = req.body;
    tea.name = name;
    tea.price = price;
    res.status(200).send(tea);
});
//delete a tea
app.delete('/teas/:id', (req, res) => {
    const index = teaData.findIndex(t => t.id === parseInt(req.params.id));

    if(index == -1){
        return res.status(404).send("Tea not found");
    }
    
    teaData.splice(index, 1);
    return res.status(202).send("delelted");
});

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});