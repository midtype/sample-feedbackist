import React, { useState } from 'react';
import styled from 'styled-components';

import Nav from './Nav';

interface IAppContext {
  categoryId: string;
  issueId: string;
  setCategoryId: (id: string) => void;
  setIssueId: (id: string) => void;
}

export const AppContext = React.createContext<IAppContext>({
  categoryId: '',
  issueId: '',
  setCategoryId: () => null,
  setIssueId: () => null
});

const Main = styled.main`
  width: 100vw;
  max-width: 1280px;
  padding: 3rem;
  margin: auto;
`;

const LayoutApp: React.FC = props => {
  const [categoryId, setCategoryId] = useState('');
  const [issueId, setIssueId] = useState('');
  const context = { categoryId, issueId, setCategoryId, setIssueId };
  return (
    <AppContext.Provider value={context}>
      <Nav />
      <Main>{props.children}</Main>
    </AppContext.Provider>
  );
};

export default LayoutApp;
