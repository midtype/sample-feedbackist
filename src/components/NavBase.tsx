import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Container } from './Layout';
import UserInfo from './NavUserInfo';
import Logo from './Logo';

import * as colors from '../utils/colors';

const NAV_HEIGHT = '5rem';

const Styled = styled.header`
  .nav {
    position: fixed;
    left: 0;
    top: 0;
    background: ${colors.WHITE(0.9)};
    width: 100vw;
    height: ${NAV_HEIGHT};
    z-index: 10;
    border-bottom: 1px solid ${colors.GRAY_2(0.5)};
  }
  .nav__container {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    align-items: center;
  }
  .nav__logo a {
    display: flex;
    align-items: center;
  }
  .nav__logo h5 {
    color: ${colors.GRAY_3()};
    margin-left: 0.5rem;
  }
  .nav--placeholder {
    width: 100vw;
    height: ${NAV_HEIGHT};
  }
`;

const NavBase: React.FC<{ title: string }> = props => {
  return (
    <Styled>
      <header className="nav">
        <Container className="nav__container">
          <div className="nav__logo">
            <Link to="/">
              <Logo width={100} />
              <h5>{props.title}</h5>
            </Link>
          </div>
          {props.children || <div />}
          <UserInfo />
        </Container>
      </header>
      <div className="nav--placeholder" />
    </Styled>
  );
};

export default NavBase;
