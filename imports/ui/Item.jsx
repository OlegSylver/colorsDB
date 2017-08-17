import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import moment from 'moment';
// Task component - represents a single todo item
export default class Item extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('items.setChecked', this.props.item._id, !this.props.item.checked);
  }

  deleteThisTask() {
    Meteor.call('items.remove', this.props.item._id);
  }

  togglePrivate() {
    Meteor.call('items.setPrivate', this.props.item._id, ! this.props.item.private);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    console.log("item="+JSON.stringify(this.props));
    let dat = moment(parseInt(this.props.item.date)).format('YYYY-MM-DD HH:MM');
    const itemClassName = classnames({
      checked: this.props.item.checked,
      private: this.props.item.private,
    });


    let trStyle={'backgroundColor':'#DDDDDD'};if(this.props.odd){ trStyle={'backgroundColor':'#FFFFFF'};}
  // </td><td>{JSON.stringify(this.props.item.times)}
  //
   let tdStyle={"borderLeftWidth":"1px", 'borderLeftStyle':'solid','borderLeftColor':'black'};

    return (
      <tr key={this.props.item._id} style={trStyle}>
      <td style={tdStyle}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
        </td><td style={tdStyle}>
        <input
          type="checkbox"
          readOnly
          checked={this.props.item.checked}
          onClick={this.toggleChecked.bind(this)}
        />
</td><td style={tdStyle}>&nbsp;{this.props.item.guid}&nbsp;
</td><td style={tdStyle}>&nbsp;{(this.props.item.colors).slice(1,-1).replace(/\s/g,'')}&nbsp;
</td><td style={tdStyle}>&nbsp;{dat}&nbsp;
</td><td style={tdStyle}>&nbsp;{JSON.stringify(this.props.item.times)}&nbsp;
      </td></tr>
    );
  }
}
