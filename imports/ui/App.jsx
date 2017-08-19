import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { dbColors, userList} from '../api/items.js';
import {ActiveSortLink,ActivePageLink } from './ActiveLink.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import Item from './Item.jsx';
import {TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted, TiMediaFastForwardOutline, TiMediaRewindOutline} from 'react-icons/lib/ti';

class App extends Component { constructor(props) { super(props);
  this.state = { hideCompleted: false, };}
  handleSubmit(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('items.insert', text);
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() { this.setState({ hideCompleted: !this.state.hideCompleted, });}

  renderItems() { let filteredItems = this.props.items;
    // console.log("user:"+JSON.stringify(Meteor.users.find({}).fetch()));
    // console.log("items:"+JSON.stringify(filteredItems));
    if (this.state.hideCompleted) {filteredItems = filteredItems.filter(item => !item.checked);}
    let data =[]; trOdd=true;
    filteredItems.map((item) => {
      // console.log("item:"+JSON.stringify(item));
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = item.owner === currentUserId;
      data.push(<Item
          key={item._id}
          item={item}
          odd={trOdd}
          showPrivateButton={showPrivateButton}
        />);
      if(trOdd){trOdd=false;}else{trOdd=true;}
    });

    let thStyle={"borderLeftWidth":"1px", 'borderLeftStyle':'solid','borderLeftColor':'black'};
    let btStyle={'padding':'5px','cursor':'default','textDecoration': 'none','cursor': 'pointer'};
  return (<div key="resultsList">
  <table style={{"borderWidth":"1px", 'borderStyle':'solid'}}>
    <thead style={{"backgroundColor":'#b8b8b8'}}><tr>
      <th style={thStyle}>Del</th>
      <th style={thStyle}>Sel</th>
      <th key='Id' style={thStyle}><ActiveSortLink onSelectedSort={this.onSelectedSort} cid="sortID" key="sortID" icon='unsort' text="Id" /></th>
      <th key='Colors' style={thStyle}><ActiveSortLink onSelectedSort={this.onSelectedSort}  cid="sortColors" key="sortColors" icon='unsort' text="Colors" /></th>
      <th key='Date' style={thStyle}><ActiveSortLink onSelectedSort={this.onSelectedSort}  cid="sortDate" key="sortDate" icon='unsort' text="Date" /></th>
      <th style={thStyle}>Times</th>
      </tr></thead>
    <tbody>{data}</tbody>
      <tfoot style={{"backgroundColor":'#b8b8b8'}}>
    <tr>
      <td></td><td></td>
      <td colSpan={4}>
        <ActivePageLink onSelectedSort={this.onNextPage} current={1} total={1}  cid="linkPage" key="linkPage" />
        </td>
    </tr></tfoot></table></div>);
    }

onSelectedSort(name,sortOrder){
  console.log("select sort=",name,sortOrder);
}

onNextPage(prevOrNext){

  console.log("prevOrNext=",prevOrNext);
}

render() { return ( <div className="container">
        <header><label style={{'display': "inline-block"}}><AccountsUIWrapper /></label>&nbsp;&nbsp;&nbsp;&nbsp;
          <h1>Test Results List ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
             Hide Selected Results
           </label></header>
         {this.renderItems()}
          <div id='footer' style={{'position':'absolute', 'bottom':'0px', 'width':'100%', 'height':'30px', 'background':'blue','textAlign':'center'}}>
            <div style={{'textAlignVertical': "center",'marginTop': '5px'}}>
            <span style={{'color': 'white'}}>&copy;2017&nbsp;<strong>Ongoza.com</strong></span>
          </div></div>
      </div> );}
    }


export default createContainer(() => {
  Meteor.subscribe('dbColors');
  Meteor.subscribe('userList');
  // console.log("user="+ Meteor.user());
  return {
    // userList: userList.find().fetch(),
    items: dbColors.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: dbColors.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };}, App);
