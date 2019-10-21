import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import Button from './Button';
import IconGoogle from './IconGoogle';

import { AppContext } from './Layout';

interface IProps {}

const Styled = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 11;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: 250ms all;

  &.open {
    opacity: 1;
    visibility: visible;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  }
  .modal {
    position: relative;
    width: 30rem;
    background: white;
    padding: 2rem;
    text-align: center;
  }
  .modal__title {
    margin-bottom: 1rem;
  }
  .modal__description {
    margin-bottom: 2rem;
  }
  .modal__button,
  .modal__button h5 {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal__button svg {
    fill: black;
    margin-right: 0.5rem;
  }
`;

const SIGN_IN_LINK = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=310346463088-u5mebbn91d619r4poms613jvssm1gevn.apps.googleusercontent.com&redirect_uri=https://api-staging.midtype.com/login&access_type=offline&state=name%3D${process.env.REACT_APP_MY_APP_ID}%26redirect%3Dhttp%3A//localhost%3A3000/login&scope=profile%20email`;

const LoginModal: React.FC<IProps> = props =>
  ReactDOM.createPortal(
    <AppContext.Consumer>
      {context => (
        <Styled className={context.loginModalOpen ? 'open' : 'closed'}>
          <div className="mask" onClick={context.toggleLoginModal} />
          <div className="modal">
            <h3 className="modal__title">
              Login to {process.env.REACT_APP_MY_APP_NAME}
            </h3>
            <p className="modal__description">
              Login or sign up using a valid Google account.
            </p>
            <div className="modal__button">
              <a href={SIGN_IN_LINK}>
                <Button>
                  <IconGoogle />
                  Continue With Google
                </Button>
              </a>
            </div>
          </div>
        </Styled>
      )}
    </AppContext.Consumer>,
    document.body
  );

export default LoginModal;
