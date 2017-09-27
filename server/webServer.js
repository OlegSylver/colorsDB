// Web server for recieving data from clients and put it to MongoDB

var port = 27080;
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var arrSessinons=[];
var arrCurrentUsers=[];
// list server commands:
// curl --data 'docs=[{"x":1}]' 'http://localhost:27080/local/dbTutorials/_insert'
// curl --data 'docs={}' 'http://localhost:27080/local/dbTutorials/_find'
// curl -X GET 'http://localhost:27080/local/dbTutorials/_login?l=os@ongoza.com&p=11'
// curl -X GET 'http://localhost:27080/local/dbTutorials/_register?l=os@ongoza.com&p=11'
// curl -X GET 'http://localhost:27080/local/dbTutorials/_unregister?l=os@ongoza.com&p=11'
// curl -X GET 'http://localhost:27080/local/dbTutorials/_logout?l=os@ongoza.com&s=11'
var server = http.createServer(Meteor.bindEnvironment(function(request, response){
    response.writeHead(200, {'Content-type':'text/plan'});
    let urlParts = url.parse(request.url);
    var query= querystring.parse(urlParts.query);
    var cmd= urlParts.pathname;
    //console.log('cmd=' + cmd+" query=", query);
    var body = '';
    request.on('data', function(data){ body += data; if (body.length > 1e6){ console.log('Too many data'); response.end("Too many data."); request.connection.destroy()};});
    request.on('end', function(){sendCommand(response,cmd,body,query)});
    request.on('error', function(){response.end("Error!"); console.log(' error data=',cmd,body,query);});
})).listen(port);


createSessionID = function(){return id = 1000000000+~~(Math.random()*1000000000);}

sendCommand=Meteor.bindEnvironment(function(response,cmd,data,query){
  console.log('cmd&data=', cmd, data, query);
  if("/favicon.ico"!=cmd){
    let answer= JSON.stringify({'Server':"No data."});
    let dbList= {'dbColors':dbColors,'dbTutorials':dbTutorials};
    let arrCmd = cmd.split('/');
    if(arrCmd.length>3){
      if(dbList[arrCmd[2]]){
        let post, postJson,len;
        switch (arrCmd[3]) {
          case "_logout":
            if(query.l&&query.s){
                    let sesionId = query.s;
                    let i = arrSessinons.indexOf(sesionId);
                    if(i>-1){
                      arrSessinons.splice(i, 1);
                      answer=JSON.stringify({'logout':1});
                      for(let k=0;k<arrCurrentUsers.length;k++){
                        if(sesionId==arrCurrentUsers[k][2]){arrCurrentUsers.splice(k, 1);}}
                      }else{ // should  the server delete all sessions for this login?
                          console.log('Not correct session data.');}
                }else{answer=JSON.stringify({'logout':-1});}
            break;
            case "_unregister":
              if(query.l&&query.p){
                let user = Accounts.findUserByEmail(query.l);
                console.log('user=',user);
                if(user){
                  let profile: { name: { first: String, last: String } };
                  let result = Accounts.createUser({email:query.l,password:query.p});
                   console.log('result=',result);
                  if(!result.error){
                      let id = createSessionID();
                      while(arrSessinons.indexOf(id)>-1){id = createSessionID();}
                      arrSessinons.push(id);
                      arrCurrentUsers.push([id,new Date().getTime(),id,query[0],query[1]]);
                      answer=JSON.stringify({'unregisterID':id});
                      console.log('login=', arrCmd[3],' db=',arrCmd[2],' id='+id,' arr=',arrCurrentUsers);
                    }else{ answer= JSON.stringify({'unregisterID':-3})}
                  }else{ answer= JSON.stringify({'unregisterID':-2})}
                }else{ answer= JSON.stringify({'unregisterID':-1})}
                break;
            case "_register":
              if(query.l&&query.p){
                let user = Accounts.findUserByEmail(query.l);
                console.log('user=',user);
                if(!user){
                  let profile: { name: { first: String, last: String } };
                  let result = Accounts.createUser({email:query.l,password:query.p});
                   console.log('result=',result);
                  if(!result.error){
                      let id = createSessionID();
                      while(arrSessinons.indexOf(id)>-1){id = createSessionID();}
                      arrSessinons.push(id);
                      arrCurrentUsers.push([id,new Date().getTime(),id,query[0],query[1]]);
                      answer=JSON.stringify({'registerID':id});
                      console.log('login=', arrCmd[3],' db=',arrCmd[2],' id='+id,' arr=',arrCurrentUsers);
                    }else{ answer= JSON.stringify({'registerID':-3})}
                  }else{ answer= JSON.stringify({'registerID':-2})}
                }else{ answer= JSON.stringify({'registerID':-1})}
                break;
          case "_login":
            if(query.l&&query.p){
              let user = Accounts.findUserByEmail(query.l);
              // console.log('user=',user);
              if(user){
                let result = Accounts._checkPassword(user, query.p);
                // console.log('result=',result);
                if(!result.error){
                    let id = createSessionID();
                    while(arrSessinons.indexOf(id)>-1){id = createSessionID();}
                    arrSessinons.push(id);
                    arrCurrentUsers.push([id,new Date().getTime(),id,query[0],query[1]]);
                    answer=JSON.stringify({'sessionID':id});
                    console.log('login=', arrCmd[3],' db=',arrCmd[2],' id='+id,' arr=',arrCurrentUsers);
                  }else{ answer= JSON.stringify({'sessionID':-3})}
                }else{ answer= JSON.stringify({'sessionID':-2})}
              }else{ answer= JSON.stringify({'sessionID':-1})}
              break;
          case '_find':
            console.log('find=', arrCmd[3],' db=',arrCmd[2]);
            if(query.l&&query.p&&data){
              try{
                 post = data.substring(5);
                // post ='{"guid":"5a0bcde4-5513-4bd9-87c6-392680ba416d"}';
                postJson = JSON.parse(post);
                console.log('postJson=', postJson);
                let user = Accounts.findUserByEmail(query.l);
                if(user){
                  let result = Accounts._checkPassword(user, query.p);
                  if(!result.error){
                    console.log('Result: start',arrCmd[2]);
                     let dbResult = dbList[arrCmd[2]].find(postJson,{reactive: false}).fetch();
                    // let dbResult = dbList['dbColors'].find({},{reactive: false}).fetch();
                   // console.log('!!!answer=', dbResult);
                    answer = JSON.stringify({'findResult':dbResult});
                  }else{ answer= JSON.stringify({'findResult':-3})}
                }else{ answer= JSON.stringify({'findResult':-2})}
              }catch(e){answer = JSON.stringify({'findResult':-4}); console.log(answer); }
            }else{ answer= JSON.stringify({'findResult':-1})}
            break;
          case '_insert':
            if(data){
              try{
                post = data.substring(5);
                postJson = JSON.parse(post);
                console.log('postJson=', postJson);
                len = postJson.length;
                if(len){for(var i=0;i<len;i++){
                    dbList[arrCmd[2]].insert(postJson[i], function(error,result){if(error){console.log('InsertionError: '+error);}});
                }}
              }catch(e){answer = JSON.stringify({'newSessionID':'Error parse json.'}); console.log(answer); }
            }else{answer= JSON.stringify({'newSessionID':'No data for insert.'}); console.log(answer);}
            break;
          default:  answer= JSON.stringify({'Server':"Can not recognize command"});  break;
        }
      }else{ answer = 'Error db does not exist path='+cmd; console.log(answer);}
    }else{answer ='Error pathName path='+cmd; console.log(answer);}
    response.write(answer);
    response.end();
    console.log(answer);
  } //else{ console.log("fav ico");}
});

// check and remove old sessions each 10 min
setInterval(checkOldSessions, 600000);

function checkOldSessions(){
  console.log("Check old connections.");
  // delete connection older then 1 hour
  let oldTime = new Date().getTime()-3600000;
  for(let k=0;k<arrCurrentUsers.length;k++){
    if(oldTime>arrCurrentUsers[k][1]){
      let i = arrSessinons.indexOf(id);
      console.log("delete old connections ",arrCurrentUsers[k]);
      if(i>-1){arrSessinons.splice(i, 1);}
      arrCurrentUsers.splice(k, 1);
    }}
}
