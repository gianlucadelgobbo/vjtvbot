const tmi = require('tmi.js');
const config = require('config');
const valid = ["!love", "!risehands"];


// Create a Twitch client with our options
const client = new tmi.client(config.opts);

// Register our Twitch event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('join', onJoinHandler);

// Connect to Twitch:
client.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

/* var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
}; */

// Called every time a message comes in
function onJoinHandler (target, username, bho) {
  var mess = "Hi "+username + " to know about the current video send the message \"!current\" in this chat";
  //mess+="\nTitle: " + dat.data.video.title;
  //mess+="\nAuthor: " + dat.data.video.users[0].stagename;
  //mess+="\nURL: https://avnode.net/videos/" + dat.data.video.slug;
  console.log(username+" joined "+target);
  var exlude = []
  if (exlude.indexOf(username)===-1) client.say(target, mess);
}

function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!current') {
    const https = require('https');
    var data = "";
    https.get('https://avnode.net/api/getcurrentprogram', (resp) => {
    
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        var dat = JSON.parse(data);
        var mess = "";
        mess+="\nTitle: " + dat.data.video.title;
        mess+="\nAuthor: " + dat.data.video.users[0].stagename;
        mess+="\nURL: https://avnode.net/videos/" + dat.data.video.slug;
        console.log("----------------------");
        console.log(target);
        client.say(target, mess);
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}