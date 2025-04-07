import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest } from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;

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
    const { name } = data;

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

    if (name === 'rand') {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      const formattedNumber = randomNumber < 10 ? `0${randomNumber}` : `${randomNumber}`;
    
      let funMessage;
    
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
