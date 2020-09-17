const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Plant = require('./models/plant'); 
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const app = express();
const port = process.env.PORT || 5001;

mongoose.connect('mongodb+srv:mcmillanr:deakin@cluster0.kw5ly.mongodb.net/sit209', 
        { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
app.use(express.static(`${__dirname}/public/generated-docs`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
{
    extended: true
}));

app.use((req, res, next) => 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

client.on('connect', () => 
{
    client.subscribe('/IPLANT/0/');
    client.subscribe('/IPLANT/1/');
    client.subscribe('/IPLANT/2/');
    client.subscribe('/IPLANT/3/');
    client.subscribe('/IPLANT/4/');
    client.subscribe('/IPLANT/5/');
    client.subscribe('/IPLANT/6/');
    client.subscribe('/IPLANT/7/');
    client.subscribe('/IPLANT/8/');
    client.subscribe('/IPLANT/9/');
    client.subscribe('/IPLANT/10/');
    console.log('mqtt connected');
});

client.on('message', (topic, message) => 
{
    console.log(`Received message on ${topic}: ${message}`);

    const data = JSON.parse(message);
    Plant.findOne({"id": data.id }, (err, plant) => 
    {
        if (err) 
        {
            console.log(err)
        }

        plant.temp = data.data.temp;
        plant.light = data.data.light;
        plant.humidity = data.data.hum;
        plant.moisture = data.data.smoist;

        plant.save(err => 
        {
            if (err) 
            {
                console.log(err)
            }
        });
    });
});

/**
* @api {get} /docs API Docs
* @apiGroup Docs
* @apiSuccessExample {object} Success-Response:
* '/generated-docs/index.html'
* @apiErrorExample {string} Error-Response:
* null
*/

app.get('/docs', (req, res) => 
{
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

/**
* @api {post} /mqtt/send-command 
* @apiGroup Plants
* @apiSuccessExample {string} Success-Response:
* 'published new message'
* @apiErrorExample {string} Error-Response:
* 'Syntax error'
*/

app.post('/send-command', (req, res) => 
{
    const { plantId, command } = req.body;
    const topic = `/myid/command/${plantId}`;
    client.publish(topic, command, () => 
    {
        res.send('published new message');
    });
});
   
app.listen(port, () => 
{
    console.log(`listening on port ${port}`);
});
