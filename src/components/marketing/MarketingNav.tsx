import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Styled = styled.header`
  .nav {
    position: fixed;
    background: rgba(45, 45, 45, 0.98);
    width: 100vw;
    padding: 0rem 2rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nav--placeholder {
    width: 100vw;
    height: 3rem;
  }
  .nav__links__page {
    text-decoration: none;
    color: white;
    margin: 0 2rem;
    transition: 250ms opacity;
  }

  .nav__links__page:hover {
    opacity: 0.8;
  }
`;

const Nav: React.FC = () => {
  return (
    <Styled>
      <header className="nav">
        <div className="nav__links">
          <Link className="nav__links__page" to="/">
            Home
          </Link>
          <Link className="nav__links__page" to="/about">
            About
          </Link>
          <Link className="nav__links__page" to="/pricing">
            Pricing
          </Link>
        </div>
      </header>
      <div className="nav--placeholder" />
    </Styled>
  );
};

export default Nav;
