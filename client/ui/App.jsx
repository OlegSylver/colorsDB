import React, { Component} from 'react';
 import ReactDOM from 'react-dom';
 import { Meteor } from 'meteor/meteor';
 import { createContainer } from 'meteor/react-meteor-data';

 import { dbColors, userList} from '../../imports/items.js';
 import {ActiveSortLink,ActivePageLink } from './ActiveLink.jsx';
 import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 import Item from './Item.jsx';
 import {TiArrowSortedDown, TiArrowSortedUp, TiArrowUnsorted, TiMediaFastForwardOutline, TiMediaRewindOutline} from 'react-icons/lib/ti';

let sortName = new ReactiveVar('date');
 let sortOrder = new ReactiveVar(-1);
 let skipItems = new ReactiveVar(0);
 let skipSelected = new ReactiveVar(0);
 // let itemsPerPage = new ReactiveVar(20);
 let itemsPerPage = 5;

class App extends Component {
    constructor(props){ super(props);
        this.state = { hideCompleted: props.skipSelected.get(), totalPages: 1 };
        this.onSelectedSort = this.onSelectedSort.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
        this.test = this.test.bind(this);
      }

    componentWillReceiveProps(newProp){
        let num = newProp.itemsCount/itemsPerPage, num1= ~~num;
        if(num>num1){ num1++;}
        this.setState({totalPages: ~~(num1)});

      }

    handleSubmit(event) {
      event.preventDefault();
      // const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      Meteor.call('insertData', {"guid":11});
      // ReactDOM.findDOMNode(this.refs.textInput).value = '';
      }

    toggleHideCompleted(){
      this.props.skipSelected.set(!this.state.hideCompleted);
      this.setState({ hideCompleted: !this.state.hideCompleted});
    }

    renderItems() {
      if(this.props.items!=undefined){
        let filteredItems = this.props.items;
        if (this.state.hideCompleted) {filteredItems = filteredItems.filter(item => !item.checked);}
        let data =[]; trOdd=true;
        filteredItems.map((item) => {
          const currentUserId = this.props.currentUser && this.props.currentUser._id;
          const showPrivateButton = item.owner === currentUserId;
          data.push(<Item key={item._id} item={item} odd={trOdd} />);
          if(trOdd){trOdd=false;}else{trOdd=true;}
        });
        let thStyle={"borderLeftWidth":"1px", 'borderLeftStyle':'solid','borderLeftColor':'black'};
        let btStyle={'padding':'5px','cursor':'default','textDecoration': 'none','cursor': 'pointer'};
        return (<div key="resultsList">
          <table style={{"borderWidth":"1px", 'borderStyle':'solid'}}>
          <thead style={{"backgroundColor":'#b8b8b8'}}><tr>
            <th style={thStyle}>Del</th>
            <th style={thStyle}>Sel</th>
            <th key='Date' style={thStyle}><ActiveSortLink ref='date' onSelectedSort={this.onSelectedSort}  cid="date" key="sortDate" icon='down' text="Date" /></th>
            <th key='Colors' style={thStyle}><ActiveSortLink ref='colors' onSelectedSort={this.onSelectedSort}  cid="colors" key="sortColors" icon='unsort' text="Colors" /></th>
            <th style={thStyle}>Pass time</th>
            <th key='Id' style={thStyle}><ActiveSortLink ref='guid' onSelectedSort={this.onSelectedSort} cid="guid" key="sortID" icon='unsort' text="Device Id" /></th>
            <th style={thStyle}>Time in  % for selecting a card</th>
            <th style={thStyle}>Time in  ms for watching a card</th>
            </tr></thead>
          <tbody>{data}</tbody>
            <tfoot style={{"backgroundColor":'#b8b8b8'}}>
          <tr>
            <td></td><td></td>
            <td colSpan={6}>
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

    test() {
      console.log("currentUser=",this.props.currentUser);
      Meteor.call('items.checkUser', this.props.currentUser);
    }
    onNextPage(curPage){curPage--; skipItems.set(curPage*itemsPerPage);}

    render() {
      // <button key="textButton" onClick={this.handleSubmit}>Test</button>
      if (this.props.currentUser){
       return ( <div className="container">
        <header><label style={{'display': "inline-block"}}><AccountsUIWrapper /></label>&nbsp;&nbsp;&nbsp;&nbsp;

          <h1>Concentration Test Results List ({this.props.itemsCount})</h1>
          <label className="hide-completed">
            <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
             Hide Selected Results</label>
            </header>
         {this.renderItems()}
          <div id='footer' style={{'left':'0px', 'bottom':'0px', 'width':'100%', 'marginTop': '5px', 'background':'#BBBBBB','textAlign':'center'}}>
            <div style={{'textAlignVertical': "center"}}>
            <span style={{'verticalAlign': "middle"}}>&copy;2017&nbsp;<strong>Oleg Sylver</strong></span>
          </div></div>
        </div> );
      }else{return (<div className="container">
         <header><label style={{'display': "inline-block"}}><AccountsUIWrapper /></label>&nbsp;&nbsp;&nbsp;&nbsp;
           <h1>Concentration Test Results</h1></header>
          <div style={{'marginTop': '15px','textAlign':'center'}}><h1>Please login</h1></div>
          </div>
          )
    }}
  }


export default createContainer(() => {
  Meteor.subscribe('dbColors');
  let find={}, sort={}; sort[sortName.get()]= sortOrder.get();
  if(skipSelected.get()!=0){find={'checked':{'$ne': true}};}
  // console.log("sort",sort);
  return {
    items: dbColors.find(find,{limit: itemsPerPage, skip:skipItems.get(), sort}).fetch(),
    itemsCount: dbColors.find(find).count(),
    sortName, sortOrder, skipItems, skipSelected,
    currentUser: Meteor.userId(),
    };}, App);
