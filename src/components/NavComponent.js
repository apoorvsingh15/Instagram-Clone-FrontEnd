import React from "react";
import { Navbar, Nav, NavItem, Button } from "react-bootstrap";
import { logout } from "../utils";
import { Link } from "react-router-dom";
const NavComponent = () => {
  return (
    <Navbar className="modifyNav">
      <Navbar.Header>
        <Navbar.Brand>
          <Link className="logoCenter" to="/userprofile">
            <i className="fab fa-instagram" /> | Image-Sharing
          </Link>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav pullRight>
        <NavItem eventKey={2} href="#">
          <Link to="/userprofile">
            <Button onClick={logout}>Logout</Button>
          </Link>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default NavComponent;
