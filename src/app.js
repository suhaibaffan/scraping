import chalk from 'chalk';
import inquirer from 'inquirer';
import * as Rx from 'rxjs';
const Spinner = require( 'cli-spinner' ).Spinner;
import {connectToDb} from './db';
import { runScript } from './api';
import scrape from './scrape';
import { info, error, warning } from './log';
import startServer from './server';

const spinner = new Spinner({
    text: '',
    stream: process.stderr,
    onTick: function( msg ){
        this.clearLine( this.stream );
        this.stream.write( msg );
    }
});
spinner.setSpinnerString( '⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓' );

async function main () {
    const prompts = new Rx.Subject();
    const promptFutureResults = inquirer.prompt( prompts );

    const waitForAnswerTo = key => new Promise( resolve => {
        promptFutureResults.ui.process.subscribe( ({ name, answer }) => {
            if ( name === key )
                resolve( answer );
        });
    });

    prompts.next({
        name: 'type',
        type: 'list',
        message: 'This tool is to save data via an api or through puppeteer.',
        choices: [ 'api', 'puppeteer', 'view data' ],
        default: [ 'api' ]
    });

    const selectedChoice = await waitForAnswerTo( 'type' );
    
    prompts.next({
        name: 'dbhost',
        type: 'input',
        message: 'What is the host of your db?',
        default: 'sql7.freemysqlhosting.net',
        validate: x => x.length > 2
    });

    const dbHost = await waitForAnswerTo( 'dbhost' );

    prompts.next({
        name: 'dbName',
        type: 'input',
        message: 'What is the name of your db?',
        default: 'sql7371747',
        validate: x => x.length > 2
    });
    const dbName = await waitForAnswerTo( 'dbName' );

    prompts.next({
        name: 'dbUserName',
        type: 'input',
        message: 'What is the user name of your db?',
        default: 'sql7371747',
        validate: x => x.length > 2
    });
    const dbUserName = await waitForAnswerTo( 'dbUserName' );
    
    prompts.next({
        name: 'dbPassword',
        type: 'input',
        default: 'yVrPifTjQf',
        message: 'What is the password of your db?',
        validate: x => x.length === 10
    });
    const dbPassword = await waitForAnswerTo( 'dbPassword' );

    if ( !dbPassword ) {
        throw new Error( 'Password required to connect with the db.' );
    }

    info( `Connecting to db: ${dbHost}` );
    spinner.start();
    const dbConnection = await connectToDb({ host: dbHost, database: dbName, user: dbUserName, password: dbPassword });

    spinner.stop( true );
    info( 'Connected to db' );
    prompts.complete();
    if ( selectedChoice === 'api' ) {
        await runScript( dbConnection );
        process.exit( 0 );
    } else if ( selectedChoice === 'view data' ) {
        await startServer( dbConnection );
    } else {
        await scrape( dbConnection );
        process.exit();
    }
}
main();

process.on('SIGINT', function() {
    spinner.stop( true );
    console.log('Bye bye.');
    process.exit(0);
});