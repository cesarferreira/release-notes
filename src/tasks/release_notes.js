#!/usr/bin/env node
'use strict';

const Chalk = require('chalk');
const log = console.log;
const fs = require('fs');
const Utils = require('../utils/utils');
const exec = require('child_process').exec;

function cleanseData(data) {
	const arr = data.split('\n');
	let result = [];

	arr.forEach(item => {
		const lineArray = item.split(` `);
		const line = item.replace(`${lineArray[0]} `,'');
		if (line !== '') {
			result.push(line);
		}
	});

	return result;
}

function getFromTo(input) {
	const from = input[0];
	const to = input[1] || `HEAD`;
	return {from, to};
}

function getData(input) {
	return new Promise((resolve, reject) => {
		const {from, to} = getFromTo(input);
		const command = `git log --pretty=oneline ${from}...${to}`
		
		const child = exec(command, (error, stdout, stderr) => {
			if (error !== null) {
				reject(error)
				return;
			} else {
				const data = cleanseData(stdout);
				resolve(data);
			}
		});
	})
}

// Main code //
const self = module.exports = {
	init: input => {

		if (input.length == 0) {
			log(Chalk.red(`You need to specify the a hash/tag`));
			return;
		}
		const { from, to } = getFromTo(input);

		log(Chalk.bgRed.white(`                      RELEASE NOTES                      \n`))

		getData(input)
			.then(data => {

				data.forEach(item => {
					log(`- ${item}`);
				});

				// self.save(data, from, to);

			})
			.catch(err => {
				log('exec error: ' + err)
			});

	},
	save: (data, from, to) => {
		let result = [];
		result.push(`########`)
		result.push(`######## RELEASE NOTES`)
		result.push(`######## from: ${from} to ${to}`)
		result.push(`########\n`)

		data.forEach(item => {
			const formatedItem = `- ${item}`;
			result.push(formatedItem);
		});
		result = result.join('\n')
		var dir = './tmp';

		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}

		Utils.save(result, `./tmp/release_notes_${from}_${to}.txt`)
	}
};
