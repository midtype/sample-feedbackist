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
  width: 100vw;
  max-width: 1280px;
  padding: 2rem;
  margin: auto;
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
      <Main>{props.children}</Main>
      <LoginModal />
    </AppContext.Provider>
  );
};

export default LayoutApp;
