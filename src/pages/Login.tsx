import React from 'react';
import qs from 'query-string';
import { Redirect, withRouter, RouteComponentProps } from 'react-router';

import { setJWT } from '../utils/jwt';

const LoginPage: React.FC<RouteComponentProps> = props => {
  // Use React Routers' location function to get the query parameters in the URL.
  // Then check if we have a JWT included as a query parameter.
  const { location } = props;
  const { jwt } = qs.parse(location.search);

  // If we have a JWT, save it to local storage so that we can include it in all
  // requests to our API from here on.
  if (jwt && typeof jwt === 'string') {
    setJWT(jwt);
    window.location.assign('/');
  }
  return <Redirect to="/" />;
};

export default withRouter(LoginPage);
