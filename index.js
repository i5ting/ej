
var fs = require('fs');
var current_path = process.cwd();
var get = require('lodash.get');
var csv = require("fast-csv");
var debug = require('debug')('json2csv')

debug('json2csv');

function _get_key_from_obj_tree(obj, k, arr){
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
      var _new_ret = _get_key_from_obj_tree(v, k, ret);

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

function _get_array_from_json_file(input_json_name){
  var config_file = input_json_name
    // var latestBackUp = process.argv[2] ? process.argv[2] : getLatestBackup(current_path);
  var _new_json_string = JSON.parse(JSON.stringify(fs.readFileSync(config_file, {
    encoding: 'utf-8'
  })))
  var arr = JSON.parse(_new_json_string);
  
  return arr;
}

function _get_csv_stream_with_genrate_name(output_csv_name, succ_cb){
  var csvStream = csv.createWriteStream({headers: true}),
      writableStream = fs.createWriteStream(output_csv_name);

  writableStream.on("finish", function(){
    console.timeEnd("ej time ");
    succ_cb();
    debug("DONE!");
  });

  csvStream.pipe(writableStream);
  
  return csvStream;
}

function generate(input_json_name, output_csv_name, succ_cb, fail_cb) {
  console.time("ej time ");
  var arr = _get_array_from_json_file(input_json_name);
  var csvStream = _get_csv_stream_with_genrate_name(output_csv_name, succ_cb);
  
  console.log('records : ' + arr.length);
  
  for(var i in arr){
    var o = arr[i];
    
    try
    {
      //在此运行代码
      var ret = _get_key_from_obj_tree(o);

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
      fail_cb();
    }
    
  }
  
  csvStream.end();
}

module.exports = function (input_json_name, output_csv_name , succ_cb, fail_cb) {
  generate(input_json_name, output_csv_name, succ_cb, fail_cb);
}
