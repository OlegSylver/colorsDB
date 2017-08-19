import React, { Component, PropTypes } from 'react';

let listIcons = {'up':	'\u25B4','down':'\u25BE','right':'\u25BA','left':'\u25C4','unsort':'\u2666'}
let linkStyle = {'padding':'5px','cursor':'default','textDecoration': 'none','cursor': 'pointer'};
let sortOrder=['unsort','down','up'];

export class ActivePageLink extends Component {
  constructor(props) { super(props);
    this.state = { 'current': props.current,'total':props.total};
  }

  handleClick=(e) => {
    e.preventDefault();
    this.props.onSelectedSort(e.target.id);
  }

  getIcon(){ let result='';
    if(this.state.icon!=null){ result = list[this.state.icon];
  } return result;}

  render() {
      return (
        <span style={{'display': "inline-block"}}>&nbsp;&nbsp;&nbsp;
          Page:
            <a href="#" id='left' style={linkStyle} onClick={this.handleClick} >{listIcons['left']} </a>
            {this.state.current}/{this.state.total}
            <a href="#" id='right' style={linkStyle} onClick={this.handleClick} >{listIcons['right']}</a>
            </span>
          );
        }
}

export class ActiveSortLink extends Component {
  constructor(props) { super(props);
    this.state = { 'iconName': props.icon,'icon':listIcons[props.icon]};
  }

      handleClick=(e) => {
        e.preventDefault();
        let i = sortOrder.indexOf(this.state.iconName)+1;
        if(i>2){i=0;}
        let nextIcon = sortOrder[i];
        this.setState({'iconName':nextIcon});
        this.setState({'icon':listIcons[nextIcon]});
        this.props.onSelectedSort(this.props.cid,nextIcon);
      }

render() {
    return (
      <span>{this.props.text}&nbsp;
          <a href="#" style={linkStyle} onClick={this.handleClick} >
            {this.state.icon}
          </a></span>
        );
      }
    }
