const express = require('express');
const SocketServer = require('ws').Server;
const uuidV3 = require('uuid');
// Set the port to 3001
const PORT = 3001;
// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));
// Create the WebSockets server
const wss = new SocketServer({ server });
let sharedMessage = '';
let arraycolor = ['#a3fd7f', '#FFFF00', '#800000', '#2980B9'];

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(data));
      console.log('data sent to client from server');
    })
   }
wss.on('connection', (ws) => {
  console.log('Client connected');
  let newColor = arraycolor.pop();

  if(!newColor) {
    arraycolor = ['#a3fd7f', '#FFFF00', '#800000', '#2980B9'];
    newColor=arraycolor.pop();
  }
  const color = {type:'color', color : newColor};
  ws.send(JSON.stringify(color));
  const activeUsers = {'type':'userCount' ,'count':wss.clients.size};
  sharedMessage = activeUsers;
  wss.broadcast(sharedMessage);
// Broadcast to all.
   ws.on('message',(clientData) => {
   const data = JSON.parse(clientData);
      switch(data.type){
        case 'postMessage':
          data.type = 'incomingMessage';
          data.id =uuidV3();
          sharedMessage=data;
          wss.broadcast(sharedMessage);
        break;
        case 'postNotification':
        // handle post notification from client
          data.type = 'incomingNotification';
          data.id =uuidV3();
          sharedMessage = data;
          wss.broadcast(sharedMessage);
          break;
        default:
          throw new Error('Unknown event type ' + data.type);
      }
    })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    const activeUsers = {'type':'userCount' ,'count':wss.clients.size};
    sharedMessage = activeUsers;
    wss.broadcast(sharedMessage);
    console.log('Client disconnected')
  });
});


