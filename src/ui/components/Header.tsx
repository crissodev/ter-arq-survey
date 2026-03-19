/**
 * Header Component
 */

import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { navigateToHome } from "../../app/router";

interface HeaderProps {
  title?: string;
  onNavigateHome?: () => void;
}

export function Header({ title = "PCRS Risk Assessment", onNavigateHome }: HeaderProps) {
  const handleHomeClick = () => {
    onNavigateHome ? onNavigateHome() : navigateToHome();
  };

  return (
    <Navbar bg="dark" variant="dark" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand
          onClick={handleHomeClick}
          style={{ cursor: "pointer" }}
          className="fw-bold"
        >
          🛡️ {title}
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link
            onClick={handleHomeClick}
            className="text-light"
            style={{ cursor: "pointer" }}
          >
            Inicio
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
