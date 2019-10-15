import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import Avatar from './UserAvatar';
import Button from './Button';

import { UserContext } from '../App';
import { AppContext } from './Layout';
import { clearJWT } from '../utils/jwt';

const Styled = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  button {
    width: 'fit-content';
  }
  .menu {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: 1rem;
    top: 100%;
    background: white;
    border-radius: 3px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    transition: 250ms all;
  }
  &.menu-open .menu {
    visibility: visible;
    opacity: 1;
  }
  .user {
    margin-right: 1rem;
    text-align: right;
    cursor: pointer;
  }
  .user__name,
  .user__email {
    font-size: 0.8rem;
  }
  .user__email {
    font-weight: 400;
    color: gray;
  }
`;

const NavUserInfo: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useCallback(() => {
    clearJWT();
    window.location.assign('/');
  }, []);
  return (
    <UserContext.Consumer>
      {user => {
        if (!user) {
          return (
            <AppContext.Consumer>
              {context => (
                <Styled>
                  <Button onClick={context.toggleLoginModal}>Login</Button>
                </Styled>
              )}
            </AppContext.Consumer>
          );
        }
        const name = user.metadatumByUserId
          ? user.metadatumByUserId.name
          : user.private.name;
        return (
          <Styled className={menuOpen ? 'menu-open' : 'menu-closed'}>
            <div className="menu" onMouseLeave={() => setMenuOpen(false)}>
              <Button onClick={logout}>Log Out</Button>
            </div>
            <div className="user" onMouseEnter={() => setMenuOpen(true)}>
              <h4 className="user__name">{name}</h4>
              <h4 className="user__email">{user.private.email}</h4>
            </div>
            <Avatar user={user} diameter={50} />
          </Styled>
        );
      }}
    </UserContext.Consumer>
  );
};

export default NavUserInfo;
