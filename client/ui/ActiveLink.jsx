import React, { Component } from 'react';

let listIcons = {'up':	'\u25B4','down':'\u25BE','right':'\u25BA','left':'\u25C4','unsort':'\u2666'}
 let linkStyle = {'padding':'5px','cursor':'default','textDecoration': 'none','cursor': 'pointer'};
 let sortOrder=['down','up'];

export class ActivePageLink extends Component{constructor(props){ super(props);
    this.state = {'current': 1,'total':props.total};
  }

  componentWillReceiveProps(newProp){
    // console.log('new prop from link',newProp);
    this.setState({total: newProp.total});}

  handleClick=(e)=>{ e.preventDefault();
      let curentPage = this.state.current;
      // console.log('child current page ='+curentPage);
      if(e.target.id=='left'){ if(curentPage>1){curentPage--;}
      }else{ if(curentPage < this.state.total){curentPage++;}}
      if(curentPage != this.state.current){
        this.props.onSelectedSort(curentPage);
        this.setState({'current':curentPage});
      }}

  render(){
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

    setUnsort(){this.setState({'iconName': 'unsort','icon':listIcons['unsort']}); }

    handleClick=(e) => {
        e.preventDefault();
        let i = sortOrder.indexOf(this.state.iconName)+1;
        if(i>1){i=0;}
        let nextIcon = sortOrder[i];
        this.setState({'iconName':nextIcon,'icon':listIcons[nextIcon]});
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
