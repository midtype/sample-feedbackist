import React from 'react';
import styled from 'styled-components';

import CategoriesList from './CategoriesList';

export const NAV_WIDTH = '20rem';

const Styled = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  background: white;
  width: ${NAV_WIDTH};
  padding: 2rem;
  height: 100vh;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const Nav: React.FC = () => {
  return (
    <Styled>
      <CategoriesList />
    </Styled>
  );
};

export default Nav;
