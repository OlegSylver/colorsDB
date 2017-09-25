// Web server for recieving data from clients and put it to MongoDB

var port = 27080;
var http = require('http');
var url = require('url');
// test server:  curl --data 'docs=[{"x":1}]' 'http://localhost:27080/local/dbTutorials/_insert'
// curl -X GET 'http://localhost:27080/local/dbTutorials/_find'
var server = http.createServer(Meteor.bindEnvironment(function(request, response){
    response.writeHead(200, {'Content-type':'text/plan'});
    pathName= url.parse(request.url).pathname;  console.log('pathName=' + pathName);
    var body = '';
    request.on('data', function(data){ body += data; if (body.length > 1e6){ console.log('Too many data'); response.end("Too many data."); request.connection.destroy()};});
    request.on('end', function(){sendCommand(response,pathName,body)});
    request.on('error', function(){response.end("Error!"); console.log(' error data=',pathName,body);});
})).listen(port);

sendCommand=Meteor.bindEnvironment(function(response,cmd,data){
  console.log('cmd&data=', cmd, data);
  let dbTutorials = "Has to be init later.";
  let answer="Server says: No data.";
  let dbList= {'dbColors':dbColors,'dbTutorials':dbTutorials};
  let arrCmd = cmd.split('/');
  if(arrCmd.length>3){
    if(dbList[arrCmd[2]]){
      switch (arrCmd[3]) {
        case '_find':
          console.log('find=', arrCmd[3],' db=',arrCmd[2]);
          let dbResult = dbList[arrCmd[2]].find({},{reactive: false}).fetch();
          //console.log('!!!answer=', JSON.stringify({'docs':dbResult}));
          answer = JSON.stringify({'docs':dbResult});
          break;
        case '_insert':
          if(data){
            var post = data.substring(5);
            var postJson = JSON.parse(post);
            console.log('postJson=', postJson);
            var len = postJson.length;
            if(len){for(var i=0;i<len;i++){
                dbList[arrCmd[2]].insert(postJson[i],function(error,result){if(error){console.log('InsertionError: '+error);}});
            }}
          }else{answer = 'No data for insert.'; console.log(answer);}
          break;
        default:  answer="Can not recognize command";  break;
      }
    }else{ answer = 'Error db does not exist path='+cmd; console.log(answer);}
  }else{answer ='Error pathName path='+cmd; console.log(answer);}
  console.log("Server says:"+answer);
  response.write(answer);
  response.end();
});
