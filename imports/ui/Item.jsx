import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import moment from 'moment';

export default class Item extends Component {

  toggleChecked() { Meteor.call('items.setChecked', this.props.item._id, !this.props.item.checked);}

  deleteThisTask() { Meteor.call('items.remove', this.props.item._id); }

  render() {
    let dat = moment(parseInt(this.props.item.date)).format('YYYY/MM/DD\u00A0HH:MM');
    const itemClassName = classnames({
      checked: this.props.item.checked,
      private: this.props.item.private,
    });
    let trStyle={'backgroundColor':'#DDDDDD'};if(this.props.odd){ trStyle={'backgroundColor':'#FFFFFF'};}
    let tdStyle={"borderLeftWidth":"1px", 'borderLeftStyle':'solid','borderLeftColor':'black'};

    return (
      <tr key={this.props.item._id} style={trStyle}>
      <td style={tdStyle}><button className="delete" onClick={this.deleteThisTask.bind(this)}>&times;</button>
      </td><td style={tdStyle}><input type="checkbox" readOnly checked={this.props.item.checked} onClick={this.toggleChecked.bind(this)} />
      </td><td style={tdStyle}>&nbsp;{this.props.item.guid}&nbsp;
      </td><td style={tdStyle}>&nbsp;{this.props.item.colors.replace(/\D/g,'')}&nbsp;
      </td><td style={tdStyle}>&nbsp;{dat}&nbsp;
    </td><td style={tdStyle}>&nbsp;{JSON.stringify(this.props.item.times).replace(/["']/g,'').slice(1,-1)}&nbsp;
      </td></tr>
    );}}
