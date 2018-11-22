#!/usr/bin/env node
'use strict';

const exec = require('child_process').exec;
const Chalk = require('chalk');
const log = console.log;
const fs = require('fs');
const shell = require('shelljs');

Array.prototype.subarray = function (start, end) {
	if (!end) { end = -1; }
	return this.slice(start, this.length + 1 - (end * -1));
}

// Main code //
const self = module.exports = {
	run: command => {
		return new Promise((resolve, reject) => {
			try {
				shell.exec(command, { silent: false }).stdout;
				resolve();
			} catch (error) {
				reject(error);
			}
		})
	},
	isEmpty: obj => {
		return Object.keys(obj).length === 0;
	},
	save: (content, filePath) => {
		fs.writeFileSync(filePath, content, 'utf-8');
	}
};
