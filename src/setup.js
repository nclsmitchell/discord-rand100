import { ALL_COMMANDS, InstallGlobalCommands, throwIfMissing } from './utils.js';


async function setup() {
    throwIfMissing(process.env, [
        'DISCORD_PUBLIC_KEY',
        'DISCORD_APPLICATION_ID',
        'DISCORD_TOKEN',
    ]);

    InstallGlobalCommands(process.env.DISCORD_APPLICATION_ID, ALL_COMMANDS);

    console.log('Command registered successfully');
}

setup();