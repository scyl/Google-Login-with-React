// server.js

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Authentication
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENTID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  
  return userid;
}

app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static('style'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/app/index.html');
});

app.post("/auth", (request, response) => {
  verify(request.get('Access-Token')).then((id) => {
    if (id === process.env.USERID) {
      response.json({result: "You are Stephen"});
    } else {
      response.json({result: "Who are you?"});
    }
  }).catch(console.error);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
