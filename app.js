// 1.得到http模块
var http = require('http')
var url = require('url')
var fs  = require('fs')
// 2.创建http服务
http.createServer(function (request, response) {
  // http://huoqishi.net:3000/index.html
  // request.url是端口号往后的一部分
  console.log(request.url)
  console.log('分割==========')
  // url.parse能自动分割request.url,生成相应的对象
  var urlObj = url.parse(request.url, true)
  console.log(urlObj)
  // 判断是不是form表单请求
 if(urlObj.pathname === '/add'){
   console.log(urlObj.query)// 这个对应就是前端get请求传来的参数
   // 保存用户提交的数据(先读取出来，然后再添加一条)
   fs.readFile('./data/users.json','utf8',function (err,data) {
     if(err){
      throw err
     }
     var arr_obj = JSON.parse(data)  
     arr_obj.push(urlObj.query)
     fs.writeFile('./data/users.json',JSON.stringify(arr_obj),function (err) {
     if(err){
      throw err
     }
     response.end('请求成功了！')
   })
   })
   // 结function
   return 
 
 // 获取用户所有用户的数据
 if(urlObj.pathname === '/getmsg'){
   fs.readFile('./data/users.json','utf8',function (err,data) {
     if(err){
      throw err
     }
     response.end(data)
   })
   return
 }
  if(urlObj.pathname === '/'){
    urlObj.pathname = '/index.html'
  }
  var filePath = './public' + urlObj.pathname
  fs.readFile(filePath,function (err, data) {
    if(err){
      return response.end('404了啊!')
    }
    // 读取mime.json文件,根据文件中内容找到对应的类型
    fs.readFile('./mime.json','utf8',function (err, mimeData) {
      if(err){
        throw err
      }
      // /index.html
      // 此时data是个字符串
      console.log(typeof mimeData)
      var mimeObj = JSON.parse(mimeData)
      // 得到文件的后缀
      var tmp = urlObj.pathname.split('.')[1]
      response.writeHead(200, {
        'Content-Type': mimeObj[tmp]
      })
      // end执行后，响应的结束,
       response.end(data)
    })
  })
})
.listen(3000,'127.0.0.1',function (err) {
   if(err){
    throw err
  }
  console.log('请求成功:请求访问: http://127.0.0.1:3000')
})
