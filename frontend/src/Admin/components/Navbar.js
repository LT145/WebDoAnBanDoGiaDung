import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AdminNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#">Admin</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#">Tài khoản</Nav.Link>
          <Nav.Link href="#">Đăng xuất</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
