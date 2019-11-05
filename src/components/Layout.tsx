import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import Nav from './Nav';
import LoginModal from './LoginModal';

interface IAppContext {
  categoryId: string;
  loginModalOpen: boolean;
  setCategoryId: (id: string) => void;
  toggleLoginModal: () => void;
}

export const AppContext = React.createContext<IAppContext>({
  categoryId: '',
  loginModalOpen: false,
  setCategoryId: () => null,
  toggleLoginModal: () => null
});

const Main = styled.main`
  margin: 2rem 0;
`;

export const Container = styled.div`
  margin: auto;
  width: 100%;
  padding: 0 2rem;
  height: 100%;
  max-width: 1280px;
`;

const LayoutApp: React.FC = props => {
  const [categoryId, setCategoryId] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const toggleLoginModal = useCallback(
    () => setLoginModalOpen(!loginModalOpen),
    [setLoginModalOpen, loginModalOpen]
  );
  const context = {
    categoryId,
    setCategoryId,
    loginModalOpen,
    toggleLoginModal
  };
  return (
    <AppContext.Provider value={context}>
      <Nav />
      <Main>
        <Container>{props.children}</Container>
      </Main>
      <LoginModal />
    </AppContext.Provider>
  );
};

export default LayoutApp;
