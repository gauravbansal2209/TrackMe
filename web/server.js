const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;

app.use(express.static('public'));
app.use((req, res, next) => 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) 
{
    res.sendFile(`${base}/login.html`);
});

app.get('/register-plant', (req, res) => 
{
    res.sendFile(`${base}/register-plant.html`);
});

app.get('/system-control', (req, res) => 
{
    res.sendFile(`${base}/system-control.html`);
});

app.get('/user-guide', (req, res) => 
{
    res.sendFile(`${base}/user-guide.html`);
});

app.get('/registration', (req, res) => 
{
    res.sendFile(`${base}/registration.html`);
});

app.get('/login', (req, res) => 
{
    res.sendFile(`${base}/login.html`);
});

app.get('/trending', (req, res) => 
{
    res.sendFile(`${base}/trending.html`);
});

app.get('/plant-data', (req, res) => 
{
    res.sendFile(`${base}/plant-data.html`);
});

app.get('/alarms', (req, res) => 
{
    res.sendFile(`${base}/alarms.html`);
});
   
app.listen(port, () => 
{
    console.log(`listening on port ${port}`);
});

app.get('*', (req, res) => 
{
    res.sendFile(`${base}/404.html`);
});
   