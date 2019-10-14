import React from 'react';
import styled from 'styled-components';

import CategoriesList from './CategoriesList';
import UserInfo from './NavUserInfo';

const NAV_HEIGHT = '5rem';

const Styled = styled.header`
  .nav {
    position: fixed;
    left: 0;
    top: 0;
    background: white;
    width: 100vw;
    padding: 0 2rem;
    height: ${NAV_HEIGHT};
    box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.05);
    z-index: 10;

    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    align-items: center;
  }
  .nav--placeholder {
    width: 100vw;
    height: ${NAV_HEIGHT};
  }
`;

const Nav: React.FC = () => {
  return (
    <Styled>
      <header className="nav">
        <div />
        <CategoriesList />
        <UserInfo />
      </header>
      <div className="nav--placeholder" />
    </Styled>
  );
};

export default Nav;
