import React from 'react';
import styled from 'styled-components';

import Nav from './MarketingNav';

const Main = styled.main`
  padding: 2rem;
`;

const LayoutMarketing: React.FC = props => {
  return (
    <React.Fragment>
      <Nav />
      <Main>{props.children}</Main>
    </React.Fragment>
  );
};

export default LayoutMarketing;
