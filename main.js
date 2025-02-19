const mineflayer = require('mineflayer');
const http = require('http');

const bot = mineflayer.createBot({
  host: 'playblocks.net', // Replace with your Java server's IP address
  port: 19132,            // Default port for Java servers
  username: 'TheOne'   // Bot's username
});

// Event listener when the bot spawns in the game
bot.on('spawn', () => {
  console.log("Bot has spawned and is ready to move!");

  // Function to make the bot walk and jump continuously
  function walkAndJump() {
    bot.setControlState('forward', true); // Start walking forward
    bot.setControlState('jump', true);   // Start jumping
  }

  walkAndJump(); // Call the function to begin movement
});

// Listen for chat messages
bot.on('chat', (username, message) => {
  if (username === bot.username) return; // Ignore messages from the bot itself

  if (message.toLowerCase() === 'botsleep') {
    console.log("Received 'botsleep' command. Bot is trying to sleep...");
    findAndSleepInBed();
  }
});

// Function to find a nearby bed and make the bot sleep
function findAndSleepInBed() {
  const bed = bot.findBlock({
    matching: block => bot.isABed(block), // Check if the block is a bed
    maxDistance: 5                        // Search radius
  });

  if (bed) {
    bot.sleep(bed)
      .then(() => {
        console.log("Bot is now sleeping.");
      })
      .catch(err => {
        console.error(`Failed to sleep: ${err.message}`);
      });
  } else {
    console.log("No bed found nearby. Bot cannot sleep.");
  }
}

// Log errors if they occur
bot.on('error', (err) => console.error(`Error: ${err.message}`));
bot.on('end', () => console.log("Bot has disconnected."));



function keepAlive() {
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Bot is alive!');
    res.end();
  }).listen(3000, () => {
    console.log('Keep-alive server is running on port 3000');
  });
}

module.exports = keepAlive; 

keepAlive();


