import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import MeteorTable from './MeteorTable.jsx';
import AppHeader from './Header.jsx';

export default class App extends Component {
    constructor(props){ super(props);}

    render() {
      console.log("app start",Meteor.userId());
      if (Meteor.userId()){
       return ( <div className="container">
            <AppHeader />
            <MeteorTable />
          <div id='footer' style={{'left':'0px', 'bottom':'0px', 'width':'100%', 'marginTop': '5px', 'background':'#BBBBBB','textAlign':'center'}}>
            <div style={{'textAlignVertical': "center"}}>
            <span style={{'verticalAlign': "middle"}}>&copy;2017&nbsp;<strong>Oleg Sylver</strong></span>
          </div></div>
        </div> );
      }else{
        return (
          <div className="container">
            <AppHeader />
             <div style={{'marginTop': '15px','textAlign':'center'}}><h1>Please login</h1></div>
          </div>
          )
    }}
  }
