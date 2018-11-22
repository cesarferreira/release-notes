#!/usr/bin/env node
'use strict';

const meow = require('meow');
const router = require('./src/router');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({ pkg }).notify();

const cli = meow(`
Usage

   $ release <command> <params>

   $ release notes <FROM> <TO>             # Commits from <FROM> to <TO>
   
 Examples

   $ release notes PR11 PR12               # Commits from PR11 to PR12
   $ release notes PR11                    # Commits from PR11 to HEAD
   $ release notes 922a67d566              # Commits from 922a67d566 to HEAD
`,
	{
		alias: {}
	});

if (cli.input.length > 0) {
	router.init(cli.input, cli.flags);
} else {
	cli.showHelp(2);
}