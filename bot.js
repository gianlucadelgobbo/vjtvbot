const tmi = require('tmi.js');
const config = require('config');

console.log(config);

// Define configuration options
const opts = {
  identity: {
    username: config.BOT_USERNAME,
    password: config.OAUTH_TOKEN
  },
  channels: [
    config.CHANNEL_NAME
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!current') {
    const https = require('https');
    var data = "";
    https.get('https://avnode.net/api/getcurrentprogram', (resp) => {
      console.log(resp);
    
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log(JSON.parse(data));
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
// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}