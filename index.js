var json2csv = require('json2csv');
var fields = ['date', 'express_company', '_id.$oid'];

var fs = require('fs');
var current_path = process.cwd();
var get = require('lodash.get');

var debug = require('debug')('json2csv')

debug('json to csv');


function _a(obj, k, arr){
  var o = obj;
  var ret = [];
  var pre = "";
  
  if (arguments.length > 1) {
    pre = arguments[1];   
    ret = arguments[2];
  }

  for(var k in o){
    var v = o[k];
    // debug('k=' + k + ', v=' + v);
    if(typeof v == 'object'){
      // debug(v + '=obj');
      var _new_ret = _a(v, k, ret);

      ret.concat(_new_ret);
    }else{
      var a = pre + '.' + k;

      if(pre.length){
        // debug(a)   
        ret.push(encode(a, v));
      }else{
        // debug(k)
        ret.push(encode(k, v));
      }
    }
  }
  
  return ret;
}

function encode(k, v) {
  return k //+ '@@' + v;
}

function decode(arr){
  // for(){
  //
  // }
}


var csv = require("fast-csv");


function _get_array_from_json_file(input_json_name){
  var config_file = input_json_name
    // var latestBackUp = process.argv[2] ? process.argv[2] : getLatestBackup(current_path);
  var _new_json_string = JSON.parse(JSON.stringify(fs.readFileSync(config_file, {
    encoding: 'utf-8'
  })))
  var arr = JSON.parse(_new_json_string);
  
  return arr;
}

function _get_csv_stream_with_genrate_name(output_csv_name){
  var csvStream = csv.createWriteStream({headers: true}),
      writableStream = fs.createWriteStream(output_csv_name);

  writableStream.on("finish", function(){
    debug("DONE!");
  });

  csvStream.pipe(writableStream);
  
  return csvStream;
}

function generate(input_json_name, output_csv_name) {
  var arr = _get_array_from_json_file(input_json_name);
  var csvStream = _get_csv_stream_with_genrate_name(output_csv_name);
  
  for(var i in arr){
    var o = arr[i];
    
    try
    {
      //在此运行代码
      var ret = _a(o);

      // debug(arr)
    
      var obj = {}
      for(var i in ret){
        var k = ret[i];
        var v = get(o, k, '');

        // debug(v);
      
        obj[k] = v;
      }
    
      csvStream.write(obj);
    }
    catch(err)
    {
      //在此处理错误
      console.log('start error\n');
      console.log(err);
      console.log(o);
      console.log('end error\n');
    }
    
  }
  
  csvStream.end();
}

generate('test/1.json', 'csv_name1.csv');
// generate('test/2.json', 'csv_name2.csv');
// generate('test/3.json', 'csv_name3.csv');