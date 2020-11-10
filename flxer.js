const tmi = require('tmi.js');
const config = require('config');
const osc = require("osc");
const valid = ["!love", "!risehands"];


// Create a Twitch client with our options
const client = new tmi.client(config.opts);

// Register our Twitch event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
//client.on('join', onJoinHandler);

// Connect to Twitch:
client.connect();

// Creating OSC port:
var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57120
});

/* udpPort.on("ready", function () {
}); */

udpPort.on("error", function (err) {
    console.log(err);
});

udpPort.open();

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
// Called every time a user comes in
function onJoinHandler (target, username) {
  var mess = "Hi "+username + " to play togeter with the performer you can use the following messages in this chat: "+ valid.join(", ");
  console.log(username+" joined "+target);
  console.log(mess);
  var exlude = []
  if (exlude.indexOf(username)===-1) client.say(target, mess);
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's send OSC
  if (valid.indexOf(commandName) !== -1) {
    sendOSC(commandName.substring(1), context['display-name'])        
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

function sendOSC (commandName, user) {
  var msg = {
    address: "/flxer/"+commandName+"/"+user,
    args: [{type: "f", value: 1}]
  };
  console.log("Sending message from ", user, msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
  udpPort.send(msg);
  
  var stop = setInterval(()=>{
    msg = {
      address: "/flxer/"+commandName+"/"+user,
      args: [{type: "f", value: 0}]
    };
    console.log("Sending message from ", user, msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    clearInterval(stop)
  },500);
}