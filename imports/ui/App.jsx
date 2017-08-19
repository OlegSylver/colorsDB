import React, { Component} from 'react';
 import ReactDOM from 'react-dom';
 import { Meteor } from 'meteor/meteor';
 import { createContainer } from 'meteor/react-meteor-data';

 import { dbColors, userList} from '../api/items.js';
 import {ActiveSortLink,ActivePageLink } from './ActiveLink.jsx';
 import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 import Item from './Item.jsx';
 import {TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted, TiMediaFastForwardOutline, TiMediaRewindOutline} from 'react-icons/lib/ti';

let sortName = new ReactiveVar('guid');
 let sortOrder = new ReactiveVar(-1);
 let skipItems = new ReactiveVar(0);
 // let itemsPerPage = new ReactiveVar(20);
 let itemsPerPage = 3;

class App extends Component {
    constructor(props){ super(props);
        this.state = { hideCompleted: false, totalPages: 1 };
        this.onSelectedSort = this.onSelectedSort.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
      }

    componentWillReceiveProps(newProp){
        // console.log("floor=",newProp.itemsCount,itemsPerPage,newProp.itemsCount/itemsPerPage,~~(newProp.itemsCount/itemsPerPage)+1);
        let num = ~~(newProp.itemsCount/itemsPerPage+1);
        this.setState({totalPages: num});
      }

    handleSubmit(event) {
      event.preventDefault();
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      Meteor.call('items.insert', text);
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
      }

    toggleHideCompleted() {
        this.setState({ hideCompleted: !this.state.hideCompleted});
      }

    renderItems() {
      // console.log("dd=",this.props.items);
      if(this.props.items!=undefined){
        let filteredItems = this.props.items;
        // this.setState({'totalPages': filteredItems.length});
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
            <th key='Id' style={thStyle}><ActiveSortLink ref='guid' onSelectedSort={this.onSelectedSort} cid="guid" key="sortID" icon='down' text="Id" /></th>
            <th key='Colors' style={thStyle}><ActiveSortLink ref='colors' onSelectedSort={this.onSelectedSort}  cid="colors" key="sortColors" icon='unsort' text="Colors" /></th>
            <th key='Date' style={thStyle}><ActiveSortLink ref='date' onSelectedSort={this.onSelectedSort}  cid="date" key="sortDate" icon='unsort' text="Date" /></th>
            <th style={thStyle}>Times</th>
            </tr></thead>
          <tbody>{data}</tbody>
            <tfoot style={{"backgroundColor":'#b8b8b8'}}>
          <tr>
            <td></td><td></td>
            <td colSpan={4}>
              <ActivePageLink ref='actPage' onSelectedSort={this.onNextPage} total={this.state.totalPages}  cid="linkPage" key="linkPage" />
              </td>
          </tr></tfoot></table></div>);
        }
      }

    onSelectedSort(name,sortOrder){
        let n = this.props.sortOrder.get() === 1 ? -1 : 1;
        let oldName = this.props.sortName.get();
        // console.log('refs.props=',this.refs[oldName].props.icon);
        if(oldName!=name){
          this.refs[oldName].setUnsort();}
        this.props.sortName.set(name);
        this.props.sortOrder.set(n);
      }

    onNextPage(curPage){curPage--; skipItems.set(curPage*itemsPerPage);}

    render() { return ( <div className="container">
        <header><label style={{'display': "inline-block"}}><AccountsUIWrapper /></label>&nbsp;&nbsp;&nbsp;&nbsp;
          <h1>Concentration Test Results List ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
             Hide Selected Results
           </label></header>
         {this.renderItems()}
          <div id='footer' style={{'position':'fixed', 'left':'0px', 'bottom':'0px', 'width':'100%', 'height':'30px', 'background':'blue','textAlign':'center'}}>
            <div style={{'textAlignVertical': "center",'marginTop': '5px'}}>
            <span style={{'color': 'white'}}>&copy;2017&nbsp;<strong>Ongoza.com</strong></span>
          </div></div>
      </div> );}
      }


export default createContainer(() => {
  Meteor.subscribe('dbColors');
  let sort={}; sort[sortName.get()]= sortOrder.get();
  // console.log('sort=',items.length);
  return {
    // userList: userList.find().fetch(),
    items: dbColors.find({},{limit: itemsPerPage, skip:skipItems.get(), sort}).fetch(),
    itemsCount: dbColors.find({}).count(),
    sortName, sortOrder, skipItems,
    currentUser: Meteor.userId(),
    };}, App);
