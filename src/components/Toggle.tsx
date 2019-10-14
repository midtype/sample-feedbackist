import React from 'react';
import styled from 'styled-components';

interface IToggleProps {
  checked: boolean;
}

const Styled = styled.header`
  box-sizing: content-box;
  display: flex;
  width: 3rem;
  height: 1.5rem;
  border-radius: 1rem;
  border: 2px solid white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  .toggle__button {
    width: 50%;
    height: 100%;
    border-radius: 50%;
    background: white;
    margin-left: 0%;
    transition: 250ms all;
  }
  &.checked {
    background: #f8e71c;
  }
  &.checked .toggle__button {
    margin-left: 50%;
  }
`;

const Toggle: React.FC<IToggleProps> = props => {
  return (
    <Styled className={props.checked ? 'checked' : 'unchecked'}>
      <div className="toggle__button" />
    </Styled>
  );
};

export default Toggle;
