#!/usr/bin/env node
/**
 * Created by kmorris on 11/8/14.
 */
/* jshint node:true */
/* global process */
"use strict";

var btoa    = require('btoa'), //jshint ignore:line
	execSh  = require('exec-sh'),
	fs      = require('fs-extra'),
	argv    = require('minimist')(process.argv.slice(2), {
		alias: {
			'project': ['p', 'proj']
		}
	}),
	path    = require('path'),
	prompt  = require('prompt'),
	queue   = require('async').queue,
	request = require('request-json'),
	series  = require('async').series;

var promptSchema = {
	properties: {
		username: {
			required: true
		},
		password: {
			required: true,
			hidden  : true
		}
	}
};

var apiBaseUrl = 'https://stash.moxieinteractive.com/rest/api/1.0',
	client     = request.newClient(apiBaseUrl),
	apiCredentials;

var project = argv.project || null;

function init() {
	prompt.message = "[?]".green;
	prompt.override = argv;
	series([
		validateParameters,
		promptCredentials,
		verifyProjectDeletion,
		deleteProjectRepos,
		deleteProject
	], function (err) {
		if (err) {
			console.log(err.message.red);
		} else {
			console.log("Completed without errors".green);
		}
	});
}

function validateParameters(cb) {
	if (!project) {
		console.log("You must supply the --project parameter.".red);
		process.exit();
	} else {
		project = project.toUpperCase();
	}
	//if (project.substring(0, 4) !== 'TEST') {
	//	console.log("During dev, project name must begin with the 'test'".red);
	//	process.exit();
	//}
	cb(null, 'validateParametersComplete');
}

function setApiAuth(creds) {
	client.setBasicAuth(creds.username, creds.password);
	apiCredentials = "Basic " + btoa(creds.username + ":" + creds.password);
}

function promptCredentials(cb) {
	try {
		setApiAuth(require('./creds'));
		cb(null, "loadCredentialsComplete");
	} catch (e) {
		prompt.get(promptSchema, function (err, results) {
			setApiAuth(results);
			cb(null, "promptCredentialsComplete");
		});
	}
}

function verifyProjectDeletion(cb) {
	prompt.get([{
		name       : 'verify1',
		description: 'Are you sure? (Y or N)'.red
	}], function (err, results) {
		if (!results.verify1 || results.verify1.toLowerCase() !== 'y') {
			return cb(new Error('Cancelling deletion.'.red));
		}
		prompt.get([{
			name       : 'verify2',
			description: ("Are you REALLY sure? ALL REPOSITORIES in the " + project + " project will be deleted.").red + "\nIf that is what you want, type " + '"Let\'s do this!"'.yellow
		}], function (err, results) {
			if (!results.verify2 || results.verify2 !== "Let's do this!") {
				return cb(new Error('Cancelling deletion.'.red));
			}
			// ok, we're going to do it
			cb();
		});
	});
}

function deleteProjectRepos(cb) {
	var reposUri = path.join('/projects', project, 'repos');
	client.get(reposUri, function (err, res, body) {
		if (body.errors) {
			return cb(new Error(body.errors[0].message));
		}

		var q = queue(function (item, callback) {
			client.del(path.join(reposUri, item.slug), function (err, res, body) {
				if (body.errors) {
					return callback(new Error(body.errors[0].message));
				}
				console.log(item.slug + ' deleted!');
				callback();
			});
		}, 1);

		q.drain = function () {
			console.log('all items processed');
			cb();
		};

		body.values.forEach(function (item) {
			q.push(item);
		});
	});
}

function deleteProject(cb) {
	client.del(path.join('/projects', project), function (err, res, body) {
		if (body.errors) {
			return cb(new Error(body.errors[0].message));
		}
		cb();
	});
}

init();

