import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import Nav from './Nav';
import LoginModal from './LoginModal';

interface IAppContext {
  categoryId: string;
  issueId: string;
  loginModalOpen: boolean;
  setCategoryId: (id: string) => void;
  setIssueId: (id: string) => void;
  toggleLoginModal: () => void;
}

export const AppContext = React.createContext<IAppContext>({
  categoryId: '',
  issueId: '',
  loginModalOpen: false,
  setCategoryId: () => null,
  setIssueId: () => null,
  toggleLoginModal: () => null
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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const toggleLoginModal = useCallback(
    () => setLoginModalOpen(!loginModalOpen),
    [setLoginModalOpen, loginModalOpen]
  );
  const context = {
    categoryId,
    issueId,
    setCategoryId,
    setIssueId,
    loginModalOpen,
    toggleLoginModal
  };
  return (
    <AppContext.Provider value={context}>
      <Nav />
      <Main>{props.children}</Main>
      <LoginModal />
    </AppContext.Provider>
  );
};

export default LayoutApp;
