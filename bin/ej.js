#!/usr/bin/env node

var argv = process.argv;

var current_path = process.cwd();

json = current_path + '/' + argv[2]
csv  = argv[3]

var generate = require('../index');

generate(json, csv, function(){
  
}, function(){
  
});