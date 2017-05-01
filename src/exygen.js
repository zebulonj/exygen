#!/usr/bin/env node

import minimist from 'minimist';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const help = `
  Usage: exygen init [options] [target]
`;

const argv = minimist( process.argv.slice( 2 ) );
const command = argv._[0];
const target = argv._[1] || './src';

if ( command === 'init' && !( argv.help || argv.h ) ) {
  const boilerplateRoot = path.resolve( __dirname, '../boilerplate' );
  const targetPath = path.resolve( process.cwd(), target );

  exec( `mkdir -p ${ targetPath } && cp -nR ${ boilerplateRoot }/* ${ targetPath }`, () => {
    console.log( "Done!" );
  });
}
else {
  console.log( help );
}
