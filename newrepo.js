#!/usr/bin/env node
/**
 * Created by kmorris on 10/16/14.
 */
/* jshint node:true*/
"use strict";

var _       = require('lodash'),
	btoa    = require('btoa'),
	execSh  = require('exec-sh'),
	fs      = require('fs-extra'),
	argv    = require('minimist')(process.argv.slice(2), {
		alias: {
			'project'   : ['p', 'proj'],
			'repository': ['r', 'repo'],
			'username'  : ['user'],
			'password'  : ['pass']
		}
	}),
	path    = require('path'),
	prompt  = require('prompt'),
	request = require('request-json'),
	series  = require('async').series,
	uuid    = require('uuid');

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

var apiBaseUrl = 'https://stash.hugeinc.com/rest/api/1.0',
	client     = request.newClient(apiBaseUrl),
	apiCredentials;

var project    = argv.project || null,
	repository = argv.repository || null;

var repositoryInfo;

function init() {
	prompt.message = "[?]".green;
	prompt.override = argv;
	series([
		validateParameters,
		promptCredentials,
		createProject,
		createRepository
	], function (err, results) {
		console.log("done".blue);
	});
}

function validateParameters(cb) {
	if (!project || !repository) {
		console.log("You must supply both the --project and --repo parameters.".red);
		process.exit();
	} else {
		project = project.toUpperCase();
	}
	cb();
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

function createProject(cb) {
	//var requestUri = apiBaseUrl + '/projects/' + project;
	client.get(path.join('/projects', project), function (err, res, body) {
		if (body.errors) {

			console.log("A project with that key does not exist so we'll create it.".red);
			prompt.get([{
				name       : 'projectName',
				description: 'Project Name',
				required   : true
			}, {
				name       : 'projectDescription',
				description: 'Project Description'
			}], function (err, results) {
				var data = {
					key        : project.toUpperCase(),
					name       : results.projectName,
					description: results.projectDescription
				};
				client.post('/projects', data, function (err, res, body) {
					console.log("post complete:", body);
					cb();
				});
			});
		} else {
			// the project exists so we're good to just continue
			cb();
		}
	});
}

function createRepository(cb) {
	// check if repo already exists

	var resourceUri = path.join('/projects', project, 'repos');
	client.get(path.join(resourceUri, repository), function (err, res, body) {
		if (body.errors) {
			// repo doesn't exist so let's create it
			var data = {
				"name"    : repository,
				"scmId"   : "git",
				"forkable": true
			};

			client.post(resourceUri, data, function (err, res, body) {
				repositoryInfo = body;
				initializeRepo(cb);
			});

		} else {
			// repo exists so throw an error
			repositoryInfo = body;
			initializeRepo(cb);
		}
	});
}

function initializeRepo(cb) {
	var dirName = uuid.v4();
	var cloneUrl = _.filter(repositoryInfo.links.clone, function (link) {
		return link.name === 'ssh';
	})[0].href;

	fs.mkdirSync(dirName);

	execSh([
		'git init .',
		'touch .gitignore',
        'echo "# ' + repository + '" > README.md',
		'git add --all',
		'git commit -m"initial commit"',
		'git remote add origin ' + cloneUrl,
		'git branch develop',
		'git push origin --all',
		'git push origin --tags'
	], {cwd: path.join('./', dirName)}, function () {
		// delete temp directory
		fs.removeSync(dirName);
		// now set the default branch to be develop
		var data = {
			id: 'refs/heads/develop'
		};
		client.put(path.join('/projects', project, 'repos', repository, 'branches/default'), data, function () {
			cb();
		});
	});

}


init();
