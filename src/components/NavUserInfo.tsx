import React from 'react';
import styled from 'styled-components';

import Avatar from './UserAvatar';
import { UserContext } from '../App';

const Styled = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .user {
    margin-right: 1rem;
    text-align: right;
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
  return (
    <UserContext.Consumer>
      {user => {
        if (!user) {
          return null;
        }
        const name = user.metadatumByUserId
          ? user.metadatumByUserId.name
          : user.private.name;
        return (
          <Styled>
            <div className="user">
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
