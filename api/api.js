const mongoose = require('mongoose');
/*mongoose.connect('mongodb+srv://gbansal:Mayank5416@cluster0.t4zta.mongodb.net', 
    {useNewUrlParser: true, useUnifiedTopology: true });*/

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, useUnifiedTopology: true });    

const Device = require('./models/device');  
const User = require('./models/user'); 

const express = require('express');
const app = express();

const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/public`));

app.use(function (req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
    next();
});

const port = process.env.PORT || 5000;
/*
app.post('/api/devices', (req, res) => { 
    console.log(req.body);
});*/

app.use(express.static(`${__dirname}/public/generated-docs`));

app.get('/docs', (req, res) => { 
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

app.post('/api/devices', (req, res) => { 
    const { name, user, sensorData } = req.body; 
    
    const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err => {
        return err
        ? res.send(err)
        : res.send('successfully added device and data');
    }); 
});

app.post('/api/authenticate', (req, res) => {
    const { name, password } = req.body;

    User.findOne({ name: name }, (err, user) => {
        if (err == true) {
            return res.send("Error: Cannot connect to database");
        }

        if (!user) {
            return res.send("User does not exist!");
        }
        else if (password) {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: false
                });
            }else 
                return res.send("Incorrect Password!");
    });
});

app.post('/api/registration', (req, res) => {

    const { name, password, isAdmin} = req.body;
    User.findOne({ name: name }, (err, user) => {
        if (err == true) {
            return res.send("Error: Cannot connect to database");
        }
        if (user != undefined) {
            return res.send("User already exists!");
        }else //if (password == comfirmpassword) 
            {
                const newUser = new User({
                    name: name,
                    password,
                    isAdmin
                });
                newUser.save(err => {
                    return err
                        ? res.send(err) 
                        : res.json({
                            success: true,
                            message: "Created new User"
                        });
                });
                
            }//else {
              //  return res.send("Passwords does not match!");
            //}
    }); 
});

app.get('/api/devices/:deviceId/device-history', (req, res) => { 
    const { deviceId } = req.params;
    Device.findOne({"_id": deviceId }, (err, devices) => {
    const { sensorData } = devices;
    return err
        ? res.send(err)
        : res.send(sensorData); 
    });
});

app.get('/api/users/:user/devices', (req, res) => { 
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
    return err
        ? res.send(err)
        : res.send(devices);
    }); 
});

app.post('/api/send-command', (req, res) => { 
    console.log(req.body);
});


app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});

app.get('/', (req, res) => {
    res.sendFile(`${base}/device-list.html`); 
});


/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
*   {
*       "_id": "dsohsdohsdofhsofhosfhsofh",
*       "name": "Mary's iPhone",
*       "user": "mary",
*       "sensorData": [
*           {
*               "ts": "1529542230",
*               "temp": 12,
*               "loc": {
*                   "lat": -37.84674,
*                   "lon": 145.115113
*               }
*           },
*           {
*               "ts": "1529572230",
*               "temp": 17,
*               "loc": {
*                   "lat": -37.850026,
*                   "lon": 145.117683
*               }
*           }
*       ]
*   }
* ]
* @apiErrorExample {json} Error-Response:
* {
*   "User does not exist"
* }
*/


app.get('/api/devices', (req, res) => { 
    Device.find({}, (err, devices) => {
        if (err == true) { return res.send(err);
        } else {
            return res.send(devices);
        } 
    });
});

/*
app.get('/api/devices', (req, res) => { 
    Device.find({}, (err, devices) => {
        return res.send(devices); 
    });
});*/

app.listen(port, () => {
    console.log('listening on port ${port}');
});