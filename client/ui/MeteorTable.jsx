import React, { Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { dbColors, userList} from '../../imports/items.js';
import {ActiveSortLink,ActivePageLink } from './ActiveLink.jsx';
import {Col, Label, FormControl, Button, Table} from 'react-bootstrap';
import moment from 'moment';

let sortName = new ReactiveVar('date');
 let sortOrder = new ReactiveVar(-1);
 let skipItems = new ReactiveVar(0);
 let skipSelected = new ReactiveVar(0);

 let tableHeader = [
   {name:"Del", type:"action",text:"Del",format:"Button"},
   {name:"Sel", type:"boolean",text:"Sel",format:"Boolean"},
   {name:"date", type:"activeLink",text:"Date",format:"Date"},
   {name:"colors", type:"activeLink",text:"Colors",format:"Digits"},
   {name:"total", type:"data",text:"Pass time, ms",format:"Digits"},
   {name:"guid", type:"activeLink",text:"Device ID",format:"String_8"},
   {name:"times", type:"data",text:"Time in  % for selecting a card",format:"JSON_Digits"},
   {name:"pickes", type:"data",text:"Time in  ms for watching a card",format:"JSON"},
 ];
 // let itemsPerPage = new ReactiveVar(20);
 let itemsPerPage = 5;

class MeteorTable extends Component {
    constructor(props){ super(props);
          this.state = { hideCompleted: props.skipSelected.get(), totalPages: 1 };
          this.onSelectedSort = this.onSelectedSort.bind(this);
          this.onNextPage = this.onNextPage.bind(this);
      //    this.clickMenu = this.clickMenu.bind(this);
        }
    componentWillReceiveProps(newProp){
            let num = newProp.itemsCount/itemsPerPage, num1= ~~num;
            if(num>num1){ num1++;}
            this.setState({totalPages: ~~(num1)});

          }
          // handleSubmit(event) {
          //   event.preventDefault();
          //   // const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
          //   Meteor.call('insertData', {"guid":11});
          //   // ReactDOM.findDOMNode(this.refs.textInput).value = '';
          //   }

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
                data.push(<Item key={item._id} item={item} odd={trOdd} headers={tableHeader} />);
                if(trOdd){trOdd=false;}else{trOdd=true;}
              });
              let header = tableHeader.map((value)=>{  let str;
                 if(value.type!="activeLink"){  str = <th style={thStyle} key = {value.name} > {value.text} </th>;
                 }else{ let sort; if(sortName.get()==value.name){sort="down";}else{sort="unsort";}
                  str=<th style={thStyle} key = {value.name} ><ActiveSortLink ref={value.name} onSelectedSort={this.onSelectedSort} cid={value.name} icon={sort} text={value.text} key={value.name} /></th>;
                 }  return str;
              });
              let thStyle={"borderLeftWidth":"1px", 'borderLeftStyle':'solid','borderLeftColor':'black'};
              let btStyle={'padding':'5px','cursor':'default','textDecoration': 'none','cursor': 'pointer'};
              // style={{"borderWidth":"1px", 'borderStyle':'solid'}}
              // style={{"backgroundColor":'#b8b8b8',"color": "white"}}
              return (<div key="resultsList">
                <Table striped bordered condensed>
                <thead><tr>
                  {header}
                  </tr></thead>
                <tbody>{data}</tbody>
                  <tfoot >
                <tr>
                  <td></td><td></td>
                  <td colSpan={6}>
                    <ActivePageLink ref='actPage' onSelectedSort={this.onNextPage} total={this.state.totalPages}  cid="linkPage" key="linkPage" />
                    </td>
                </tr></tfoot></Table></div>);
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

    render() {
        return (
          <div>
              {this.renderItems()}
            </div>
        )
      }

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
      };}, MeteorTable);


class Item extends Component {

      toggleChecked() { Meteor.call('items.setChecked', this.props.item._id, !this.props.item.checked);}

      deleteThisTask() { Meteor.call('items.remove', this.props.item._id); }

    //  insertData(){ dbColors.insert({"date":"111",'id':11});}

      render() {
        // let trStyle={'backgroundColor':'#DDDDDD'};if(this.props.odd){ trStyle={'backgroundColor':'#FFFFFF'};}
        let tdStyle={};
        let trStyle={};
        // let tdStyle={"borderLeftWidth":"1px", 'borderLeftStyle':'solid','borderLeftColor':'black'};
        let check = false; if(this.props.item.checked){check=this.props.item.checked;}
        //console.log('line 11=',this.props.item);
        let line = this.props.headers.map((value)=>{
          //console.log('value name=',value.name);
          if(this.props.item[value.name]){let data;
            switch(value.format) {
              case "Date": data=<td style={tdStyle} key ={value.name} >&nbsp;{moment(parseInt(this.props.item[value.name])).format('YYYY/MM/DD\u00A0HH:MM')}&nbsp;</td>;break;
              case "JSON_Digits": data=<td style={tdStyle} key ={value.name} >&nbsp;{JSON.stringify(this.props.item[value.name]).replace(/[^0-9.:,]/g,'')}&nbsp;</td>; break;
              case "JSON": data=<td style={tdStyle} key ={value.name} >&nbsp;{JSON.stringify(this.props.item[value.name]).replace(/["']/g,'').slice(1,-1)}&nbsp;</td>; break;
              case "String_8": data=<td style={tdStyle} key ={value.name} >&nbsp;{this.props.item[value.name].slice(0,8)}&nbsp;</td>; break;
              case "Digits": data=<td style={tdStyle} key ={value.name} >&nbsp;{this.props.item[value.name].replace(/\D/g,'')}&nbsp;</td>; break;
              default: data=<td style={tdStyle} key ={value.name} >&nbsp;{this.props.item[value.name]}&nbsp;</td>; break;
            }
            if(data!=undefined){return data;}
          }
        });
        line = line.filter(function(n){return n != undefined });
        return (
          <tr key={this.props.item._id} style={trStyle}>
          <td style={tdStyle} key={"delButton"} ><a href className="delete" onClick={this.deleteThisTask.bind(this)}>&times;</a></td>
          <td style={tdStyle} key={"selCheckBox"} ><input type="checkbox" readOnly checked={check} onClick={this.toggleChecked.bind(this)} /></td>
            {line}
          </tr>
        );}}
