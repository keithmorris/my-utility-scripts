#!/usr/bin/env node
"use strict";
process.chdir(__dirname);

var config = require('config').get('newsite'),
    argv = require('minimist')(process.argv.slice(2), {
        alias: {
            parent: 'p',
            webroot: 'w',
            index: 'i'
        },
        default: config.get('defaults')
    }),
    async = require('async'),
    exec = require('child_process').exec,
    fs = require('node-fs'),
    path = require('path');

if (!argv._.length) {
    console.log([
        "  \nUsage: newsite www.localtest.com [--webroot 'public' --parent '/var/www' --index] \n",
        "  dot-separated domain name (e.g. www.example.com) is the only required parameter\n",
        "  Optional Flags:",
        "    -w, --webroot [value]    The subdirectory to use as webroot. Defaults to empty (The same as app directory)",
        "    -p, --parent [value]     The directory that will be the parent of app directory (e.g. /Users/name/Sites)",
        "    -i, --index              If set, this will generate a simple index.php file with phpinfo();\n"
    ].join("\n"));
    process.exit();
}

var parentDir = argv.parent,
    domain = argv._[0],
    directoryName = (config.get('reverseDomainFormat')) ? domain.split('.').reverse().join('.') : domain,
    webroot = argv.webroot,
    siteDir = path.join(parentDir, directoryName, webroot),
    vhostConfDir = config.get('vhostConfDir'),
    createIndex = argv.index,
    templateConf = config.get('vhostTemplateFile');

async.series([
    createVhostFile,
    createSiteDirectory,
    restartApache
], function (err, results) {
    console.log('New site configuration completed.');
});

// ********************************************************************
// Functions
// ********************************************************************
function createVhostFile(done) {
    console.log('Creating vhost configuration file.');
    fs.readFile(templateConf, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.replace(/%%SITE_DIR%%/g, parentDir);
        data = data.replace(/%%DOMAIN%%/g, domain);
        data = data.replace(/%%DOMAIN%%/g, domain);
        data = data.replace(/%%WEBROOT%%/g, webroot);
        data = data.replace(/%%DIRECTORY%%/g, directoryName);

        fs.writeFile(path.join(vhostConfDir, directoryName + '.conf'), data, 'utf8', function (err) {
            if (err) {
                console.log('Error Writing Config file.');
            }
            done(err);
        });
    });
}

function createSiteDirectory(done) {
    console.log('Creating Site Directory at ' + siteDir);
    fs.mkdir(siteDir, '0777', true, function (err) {
        if (err) {
            console.log('Error creating directory:', err);
            return done(err);
        }
        if (createIndex) {
            fs.writeFile(path.join(siteDir, 'index.php'), '<?php phpinfo();', function (err) {
                if (err) {
                    console.log('error writing info file');
                }
                done(err);
            });
        } else {
            done();
        }
    });
}

function restartApache(done) {
    console.log('Restarting Apache.');
    exec('sudo apachectl restart', function (err) {
        if (err) {
            console.log('error restarting apache');
        }
        done(err);
    });
}
