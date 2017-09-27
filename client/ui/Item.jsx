import React, { Component} from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import moment from 'moment';

export default class Item extends Component {

  toggleChecked() { Meteor.call('items.setChecked', this.props.item._id, !this.props.item.checked);}

  deleteThisTask() { Meteor.call('items.remove', this.props.item._id); }

  insertData(){ dbColors.insert({"date":"111",'id':11});}

  render() {
    let dat = moment(parseInt(this.props.item.date)).format('YYYY/MM/DD\u00A0HH:MM');
    const itemClassName = classnames({
      checked: this.props.item.checked,
      private: this.props.item.private,
    });
    let trStyle={'backgroundColor':'#DDDDDD'};if(this.props.odd){ trStyle={'backgroundColor':'#FFFFFF'};}
    let tdStyle={"borderLeftWidth":"1px", 'borderLeftStyle':'solid','borderLeftColor':'black'};
    let times, pickes,check,total,guid,colors;
    if(this.props.item.check){check = this.props.item.checked;}
    if(this.props.item.total){ total = this.props.item.total;}
    if(this.props.item.guid){ guid = this.props.item.guid;}
    if(this.props.item.colors){ colors = this.props.item.colors.replace(/\D/g,'');}
    if(this.props.item.times){times = JSON.stringify(this.props.item.times).replace(/["']/g,'').slice(1,-1);}
    if(this.props.item.times){pickes = JSON.stringify(this.props.item.pickes).replace(/["']/g,'').slice(1,-1);}
    return (
      <tr key={this.props.item._id} style={trStyle}>
      <td style={tdStyle}><button className="delete" onClick={this.deleteThisTask.bind(this)}>&times;</button>
      </td><td style={tdStyle}><input type="checkbox" readOnly checked={check} onClick={this.toggleChecked.bind(this)} />
      </td><td style={tdStyle}>&nbsp;{dat}&nbsp;
    </td><td style={tdStyle}>&nbsp;{colors}&nbsp;
    </td><td style={tdStyle}>&nbsp;{total}&nbsp;
    </td><td style={tdStyle}>&nbsp;{guid}&nbsp;
    </td><td style={tdStyle}>&nbsp;{times}&nbsp;
  </td><td style={tdStyle}>&nbsp;{pickes}&nbsp;
      </td></tr>
    );}}
