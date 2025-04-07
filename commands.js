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
  description: 'Challenge to a match of rock paper scissors',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [TEST_COMMAND, RAND_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
