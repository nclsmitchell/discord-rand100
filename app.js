import 'dotenv/config';
import express from 'express';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji } from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games

app.get('/health', (_, res) => {
    res.send('Hello, world! This is a Discord bot server.');
  }
);

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY), async function (req, res) {
  // Interaction type and data
  const { type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `hello world ${getRandomEmoji()}`,
        },
      });
    }

    // "rand" command
    if (name === 'rand' || name === 'roll') {

      // Check if the user provided a max value
      let max = 100; // Default value
      if (options && options.length > 0) {
        const maxOption = options.find(option => option.name === 'max');
        if (maxOption && maxOption.value) {
          max = maxOption.value;
        }
      }

      let randomNumber;
      if (max === 1) {
        randomNumber = Math.floor(Math.random() * max);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `You tossed a coin and got ${randomNumber === 0 ? 'Heads' : 'Tails'}!`,
          },
        });
      }
      else {
        randomNumber = Math.floor(Math.random() * max) + 1;
      }

      // Return a message with the random number if max is different from 100
      if (max !== 100) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `You rolled a ${randomNumber} on a d${max}!`,
          },
        });
      }

      const formattedNumber = randomNumber < 10 ? `0${randomNumber}` : `${randomNumber}`;
      let funMessage;
    
      // Check for critical success or failure
      if (randomNumber <= 10) {
        funMessage = `🌟 Critical Success! Incredible, a mighty ${formattedNumber}! Fortune favors you today—expect miracles! ✨`;
      } else if (randomNumber >= 90) {
        funMessage = `🎲 Critical Fail! You rolled ${formattedNumber}. Brace yourself—the Game Master is grinning wickedly! 😈`;
      } else if (randomNumber === 42) {
        funMessage = `🔮 You rolled the mystical 42! You've unlocked the meaning of life, the universe, and everything! 🌌`;
      } else {
        const standardResponses = [
          `You rolled ${formattedNumber}. Solid roll! 👍`,
          `${formattedNumber}! Could be worse, could be better. 🤷`,
          `It's a ${formattedNumber}! Luck is a fickle friend today. 🍀`,
          `${formattedNumber}, interesting... the dice have spoken! 🎲`,
          `A fine roll: ${formattedNumber}. Let's see what happens next! 👀`
        ];
        funMessage = standardResponses[Math.floor(Math.random() * standardResponses.length)];
      }
    
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: funMessage,
        },
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
