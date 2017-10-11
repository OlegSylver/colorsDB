import React, { Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, FormControl, ControlLabel, Button, Overlay, Form, FormGroup, MenuItem, NavDropdown,  Navbar, Nav, NavItem} from 'react-bootstrap';

export default class AppHeader extends Component {
  constructor(props){ super(props);
    this.state = { show: false };
    this.clickMenu = this.clickMenu.bind(this);}

clickMenu(e){console.log("clickMenuHeader=",e);
  switch(e){
    case "signOut":  Meteor.logout(function(){window.location.reload();});  break;
    case "signIn":  this.setState({ show: !this.state.show });  break;
    default: break;
  }
}

render(){
  let form;
  if(Meteor.userId()){form = <NavDropdown title="Oleg" id="basic-nav-dropdown"><MenuItem eventKey={"signOut"}>Sign Out</MenuItem></NavDropdown>;
  }else{form = <NavItem id="LoginForm" ref="targetLogin" eventKey={"signIn"} ><b>Login</b>&nbsp;&nbsp;&nbsp;&nbsp;</NavItem>;}
  return (
    <div id="HeaderDiv">
      <Navbar inverse collapseOnSelect>
          <Navbar.Header> <Navbar.Brand> <a href="#" style={{color:"grey"}}>Concentration Test Results</a></Navbar.Brand> <Navbar.Toggle /> </Navbar.Header>
           <Navbar.Collapse> <Nav pullRight onSelect={this.clickMenu}>   {form}   &nbsp;&nbsp;&nbsp;&nbsp; </Nav> </Navbar.Collapse>
        </Navbar>
        <Overlay  show={this.state.show} refs="formLogin" placement="right"  container={this} >
           <CustomPopover onHide={() => this.setState({ show: false })}/></Overlay>
    </div>
    )}
}

class CustomPopover  extends Component {
  constructor(props){ super(props); this.onClickLogin = this.onClickLogin.bind(this); }

  onClickLogin(){ let self = this;
    Meteor.loginWithPassword(this.emailInput.value,this.passInput.value,function(error){
       if(error){ self.refs.LoginMsg.innerHTML=error.reason;
       }else{self.props.onHide(); window.location.reload();}
      })
  }

  render() {
    return (
        <div style={{ ...this.props.style, position: 'relative',   backgroundColor: '#EEE',
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)', border: '1px solid #CCC', borderRadius: 3,
          align:"center",marginLeft: 5,  marginTop: 5, padding: 10 }}  >
        <Form horizontal>
          <FormGroup id="popupLogin"> <Col sm={5} > <div style={{align:"center",color:"red"}} ref="LoginMsg"  />    </Col></FormGroup>
        <FormGroup id="popupLogin">
          <Col componentClass={ControlLabel} sm={2}>  Email  </Col>
          <Col sm={10} >  <FormControl type="email" inputRef={input=>this.emailInput=input} placeholder="Email" /> </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalPassword">
          <Col componentClass={ControlLabel} sm={2}> Password  </Col>
          <Col sm={10}>  <FormControl type="password" inputRef={input=>this.passInput=input} placeholder="Password" /> </Col>
        </FormGroup>
        <FormGroup>  <Col smOffset={2} sm={10}><Button onClick={this.onClickLogin}>Sign in</Button> </Col> </FormGroup>
      </Form>
      </div>
    );
  }
}
