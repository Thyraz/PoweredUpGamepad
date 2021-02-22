const program = require('./program');
const open = require('open');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/connected', (req, res) => {
    program.onGamepadConnect();
    res.status(200).send();
});

app.post('/api/moved', (req, res) => {
    program.onAxeMoved(req.body.axe, req.body.value);
    res.status(200).send();
});

app.post('/api/pressed', (req, res) => {
    program.onButtonPress(req.body.button);
    res.status(200).send();
});

app.post('/api/released', (req, res) => {
    program.onButtonRelease(req.body.button);
    res.status(200).send();
});

app.use(express.static('www')); // Static path to browser frontend

// listen (start app with 'node server.js')
app.listen(8080);
console.log("App listening on port 8080");

// Open Browser (bundle identifer is different based on OS)
setTimeout(() => {
    (async () => {
        await open('http://localhost:8080', {app: 'google chrome'});
        await open('http://localhost:8080', {app: 'google-chrome'});
        await open('http://localhost:8080', {app: 'chrome'});
    })();
}, 1000);


