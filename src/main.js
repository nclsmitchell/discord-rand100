import 'dotenv/config';
import {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} from 'discord-interactions';
import { throwIfMissing } from './utils.js';
  

export default async ({ req, res, error, log }) => {
    throwIfMissing(process.env, [
        'DISCORD_PUBLIC_KEY',
        'DISCORD_APPLICATION_ID',
        'DISCORD_TOKEN',
    ]);

    const isValid = await verifyKey(
        req.bodyBinary,
        req.headers['x-signature-ed25519'],
        req.headers['x-signature-timestamp'],
        process.env.DISCORD_PUBLIC_KEY
    );
    if (!isValid) {
        error('Invalid request.');
        return res.json({ error: 'Invalid request signature' }, 401);
    }

    const interaction = req.body;
    log(`Received interaction: ${JSON.stringify(interaction)}`);

    const { type, data } = interaction;

    if (type === InteractionType.PING) {
        return res.json({ type: InteractionResponseType.PONG}, 200);
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name, options } = data;
    
        // "test" command
        if (name === 'test') {
            // Send a message into the channel where command was triggered from
            return res.json({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    // Fetches a random emoji to send from a helper function
                    content: `hello world ${getRandomEmoji()}`,
                },
            }, 200);
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
                    }
                });
            }
            else {
                randomNumber = Math.floor(Math.random() * max) + 1;
            }
    
            // Return a message with the random number if max is different from 100
            if (max !== 100) {
                return res.json({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `You rolled a ${randomNumber} on a d${max}!`,
                    },
                }, 200);
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

            // Send the fun message as a response
            return res.json({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: funMessage,
                },
            }, 200);
        }
    
        log(`unknown command: ${name}`);
        return res.json({ error: 'unknown command' }, 400);
    }
    
    log('unknown interaction type', type);
    return res.json({ error: 'unknown interaction type' }, 400);
};
