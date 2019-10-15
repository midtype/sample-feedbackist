import React from 'react';
import styled from 'styled-components';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
}

const Styled = styled.div`
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-top-color: rgba(0, 0, 0, 0.1);
  border-radius: 100%;
  height: 16px;
  width: 16px;
  margin: auto;
  animation: rotate 0.8s infinite linear;
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const Loader: React.FC<IProps> = props => (
  <Styled className={props.className} style={props.style} />
);

export default Loader;
