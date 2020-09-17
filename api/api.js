const mongoose = require('mongoose');
const express = require('express');
const Plant = require('./models/plant'); 
const User = require('./models/user'); 

mongoose.connect("mongodb+srv://mcmillanr:deakin@cluster0.kw5ly.mongodb.net/sit209", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(function(req, res, next) 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.use(express.static(`${__dirname}/public`));

app.listen(port, () =>
{
    console.log(`listening on port ${port}`);
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
* @api {get} /api/test Test API
* @apiGroup Test
* @apiSuccessExample {string} Success-Response:
* 'The API is working!'
* @apiErrorExample {string} Error-Response:
* null
*/ 

app.get('/api/test', (req, res) => 
{
    res.send('The API is working!');
});

app.get('/api/users/:user/plants', (req, res) => 
{
    const { user } = req.params;
    Plant.find({ "user": user }, (err, plants) => 
    {
        return err ? res.send(err): res.send(plants);
    });
});

app.get('/api/plants/:plantId/plant-history', (req, res) => 
{
    const { plantId } = req.params;
    Plant.findOne({"_id": plantId }, (err, plants) => 
    {
        const { sensorData } = plants;
        return err ? res.send(err): res.send(sensorData);
    });
});

/**
* @api {get} /api/Plants All Plants in array of all Plants
* @apiGroup Plants
* @apiSuccessExample {json} Success-Response:
* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* }
* ]
* }
* ]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/

app.get('/api/plants', (req, res) => 
{
    Plant.find({}, (err, plants) => 
    {
        if (err == true) 
        {
            return res.send(err);
        }
        else 
        {
            return res.send(plants);
        }
    });
});

/**
* @api {post} /api/Plants Add Plant
* @apiGroup Plants
* @apiSuccessExample {string} Success-Response:
* 'successfully added Plant and data'
* @apiErrorExample {string} Error-Response:
* 'Syntax error'
*/

app.post('/api/plants', (req, res) => 
{
    const { name, user, temp, light, humidity, moisture } = req.body;
    const newplant = new Plant(
    {
        name,
        user,
        temp,
        light,
        humidity,
        moisture
    });
    newplant.save(err => 
    {
        return err? res.send(err): res.send('successfully added Plant and data');
    });
});

app.post('/api/authenticate', (req, res) => 
{
    const { name, password } = req.body;
    User.findOne({name}, (err, users) =>
    {
        if(err)
        {
            return res.send(err);
        }
        else if(!users)
        {   
            return res.send("User does not exist");
        }
        else if(users.password != password)
        {
            return res.send("Password incorrect");
        }
        else
        {
            return res.json(
            {
                success: true,
                message: 'Authenticated successfully',
            });      
        }
    });
});

app.post('/api/registration', (req, res) => 
{
    const { name, password } = req.body;
    User.findOne({name}, (err, users) =>
    {
        if(err)
        {
            return res.send(err);
        }
        else if(users)
        {
            return res.send("User already exists");
        }
        else
        {
            const newUser = new User(
            {
                name,
                password,
            });

            newUser.save(err => 
            {
                return err ? res.send(err): res.json(
                {
                    success: true,
                    message: 'Created new user'
                });
            });     
        }
    });
});