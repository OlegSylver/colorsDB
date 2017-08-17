import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { dbColors, userList} from '../api/tasks.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import Item from './Item.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredItems = this.props.items;
    // console.log("user:"+JSON.stringify(Meteor.users.find({}).fetch()));
    // console.log("items:"+JSON.stringify(filteredItems));
    if (this.state.hideCompleted) {
      filteredItems = filteredItems.filter(item => !item.checked);
    }
    let data =[]; trOdd=true;
    filteredItems.map((item) => {
      // console.log("item:"+JSON.stringify(item));
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = item.owner === currentUserId;
      data.push(
        <Item
          key={item._id}
          item={item}
          odd={trOdd}
          showPrivateButton={showPrivateButton}
        />
      );
      if(trOdd){trOdd=false;}else{trOdd=true;}
    });
    let thStyle={"borderLeftWidth":"1px", 'borderLeftStyle':'solid','borderLeftColor':'black'};
  return (<div key="resultsList">
  <table style={{"borderWidth":"1px", 'borderStyle':'solid'}}>
    <thead style={{"backgroundColor":'#b8b8b8'}}><tr>
      <th style={thStyle}>Del</th>
      <th style={thStyle}>Sel</th>
      <th style={thStyle}>Id</th>
      <th style={thStyle}>Colors</th>
      <th style={thStyle}>Date</th>
      <th style={thStyle}>Times</th>
      </tr></thead>
    <tbody>{data}</tbody>
    </table></div>);
  }

  render() {
    return (
      <div className="container">
        <header>
          <label style={{'display': "inline-block"}}><AccountsUIWrapper /></label>&nbsp;&nbsp;&nbsp;&nbsp;
          <h1>Test Results List ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
          Hide Watched Results
          </label>

        </header>
          {this.renderTasks()}
      </div>
    );
  }
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
  };
}, App);
