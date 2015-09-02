# ej

ej = export json to csv

[![npm version](https://badge.fury.io/js/ej.svg)](http://badge.fury.io/js/ej)


## 原因

我们使用mongodb会经常导出json

    mongoexport -d xbm-wechat-api -c senddeliveryhistories -o senddeliveryhistories.json  --jsonArray --query "{date:{\$in:['20150821','20150822']}}"

但json转成csv又没有上面的header，如果使用json2csv这样库，又无法解决对象嵌套的取值问题，所以就写了ej这个工具，它可以直接把mongoexport导出的json直接转成csv

比如

```
[
  {
    "__v": 0,
    "_id": {
      "$oid": "55bf208846b246fa238ff4d7"
    },
    "created_at": {
      "$date": "2015-08-03T08:04:24.648Z"
    },
    "date": "20150803",
  }
]
```

会生成以下4列

- __v
- _id.$oid
- created_at.$date
- date

## Install

    [sudo] npm install -g ej
    
## Usages

    ej input.json output.csv

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## 版本历史

- v1.0.0 初始化版本,实现ej导出

## 欢迎fork和反馈

- write by `i5ting` shiren1118@126.com

如有建议或意见，请在issue提问或邮件

## License

this repo is released under the [MIT
License](http://www.opensource.org/licenses/MIT).
