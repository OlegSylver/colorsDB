// Web server for recieving data from clients and put it to MongoDB

var port = 27080;
var http = require('http');
var url = require('url');
// var querystring = require('querystring');

var server = http.createServer(Meteor.bindEnvironment(function(request, response){
    response.writeHead(200, {'Content-type':'text/plan'}); response.write('Ok'); response.end( );
    pathName= url.parse(request.url).pathname;  console.log('pathName' + pathName);   //  query= url.parse(request.url).query;   //  console.log('query' + query);
     if (request.method == 'POST'&&pathName=="/local/dbColors/_insert"){ var body = '';
       request.on('data', Meteor.bindEnvironment(function(data){ body += data;
          if (body.length > 1e6){request.connection.destroy()}; }));
        request.on('end', Meteor.bindEnvironment(function(){ // var post0 = querystring.parse(body).docs;
                var post = body.substring(5);
                var postJson = JSON.parse(post);
                console.log('postJson=', postJson);
                var len = postJson.length;
                if(len){for(var i=0;i<len;i++){
                    dbColors.insert(postJson[i],function(error,result){if(error){console.log('InsertionError: '+error);}});
                  }}
                }));
        request.on('error', Meteor.bindEnvironment(function(){console.log(' error data=' + body);}));
      }
})).listen(port);
