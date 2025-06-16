import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';


// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const RAND_COMMAND = {
  name: 'rand',
  description: 'Roll a random number between 1 and 100 by default',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
  options: [
    {
      name: 'max',
      description: 'The upper limit for the random roll (default: 100)',
      type: 4, // 4 indicates an INTEGER type in Discord's API
      required: false,
      min_value: 1,
    },
  ],
};

// Command containing options
const ROLL_COMMAND = {
  name: 'roll',
  description: 'Roll a random number between 1 and 100 by default',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
  options: [
    {
      name: 'max',
      description: 'The upper limit for the random roll (default: 100)',
      type: 4, // 4 indicates an INTEGER type in Discord's API
      required: false,
      min_value: 1,
    },
  ],
};

const ALL_COMMANDS = [TEST_COMMAND, RAND_COMMAND, ROLL_COMMAND];

InstallGlobalCommands(process.env.DISCORD_APPLICATION_ID, ALL_COMMANDS);
