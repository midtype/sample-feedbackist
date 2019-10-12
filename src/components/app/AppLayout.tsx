import React from 'react';
import styled from 'styled-components';

import Nav, { NAV_WIDTH } from './AppNav';

const Main = styled.main`
  position: fixed;
  left: ${NAV_WIDTH};
  top: 0;
  width: calc(100vw - ${NAV_WIDTH});
  height: 100vh;

  padding: 2rem;
  background: #fbfbff;
`;

const LayoutApp: React.FC = props => {
  return (
    <React.Fragment>
      <Nav />
      <Main>{props.children}</Main>
    </React.Fragment>
  );
};

export default LayoutApp;
