import React from 'react';
import styled from 'styled-components';

interface IUserAvatarProps {
  user: IUser;
  diameter: number;
  className?: string;
}

const StyledAvatar = styled.div`
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #9013fe;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar: React.FC<IUserAvatarProps> = props => {
  const { metadatumByUserId: metadata } = props.user;
  if (!metadata) {
    return null;
  }
  const url = metadata.photo ? metadata.photo.location : metadata.photoUrl;
  const style = {
    backgroundImage: url ? `url('${url}')` : undefined,
    width: props.diameter,
    height: props.diameter,
    fontSize: props.diameter / 2.5
  };
  return (
    <StyledAvatar style={style} className={props.className}>
      {!url &&
        metadata.name
          .split(' ')
          .map(n => n.charAt(0))
          .join('')}
    </StyledAvatar>
  );
};

export default UserAvatar;
