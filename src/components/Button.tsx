import React from 'react';
import styled from 'styled-components';

import Loader from './Loader';

interface IProps {
  secondary?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  loading?: boolean;
}

const Styled = styled.button`
  border: 0;
  box-shadow: none;
  outline: none;
  background-color: #f8e71c;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
  transition: 250ms all;
  transform: translateZ(0);
  text-decoration: none;
  border: none;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  h5 {
    transition: 250ms opacity;
    color: black;
  }
  &.loading h5 {
    opacity: 0;
  }
  .button__loading {
    position: absolute;
    left: calc(50% - 8px);
    top: calc(50% - 8px);
    height: 16px;
    width: 16px;
  }
`;

const Button: React.FC<IProps> = props => (
  <Styled
    className={`${props.secondary ? 'secondary' : 'primary'} ${
      props.loading ? 'loading' : ''
    }`}
    onClick={props.onClick}
    style={props.style}
  >
    <h5>{props.children}</h5>
    {props.loading && <Loader className="button__loading" />}
  </Styled>
);

export default Button;
