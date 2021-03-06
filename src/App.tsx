import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Index from './pages/Index';
import Login from './pages/Login';
import ViewIssue from './pages/ViewIssue';

import GlobalStyle from './components/GlobalStyle';
import Loader from './components/Loader';

export const UserContext = React.createContext<IUser | null>(null);

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    mUserInSession {
      id
      private {
        name
        email
        photoUrl
      }
      metadatumByUserId {
        id
        name
        photo {
          id
          filename
        }
        photoUrl
      }
    }
  }
`;

const SET_USER_METADATA = gql`
  mutation SetUserMetadata($userId: UUID!, $name: String!, $photoUrl: String) {
    createMetadatum(
      input: {
        metadatum: { userId: $userId, name: $name, photoUrl: $photoUrl }
      }
    ) {
      user {
        id
        metadatumByUserId {
          id
          name
          photoUrl
        }
      }
    }
  }
`;

const App: React.FC = () => {
  const { data, loading, error } = useQuery<{ mUserInSession: IUser }>(
    GET_CURRENT_USER
  );
  const client = useApolloClient();
  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      data.mUserInSession &&
      !data.mUserInSession.metadatumByUserId
    ) {
      const user = data.mUserInSession;
      // If a user doesn't have their public metadata set already, automatically set it.
      client.mutate({
        mutation: SET_USER_METADATA,
        variables: {
          userId: user.id,
          name: user.private.name,
          photoUrl: user.private.photoUrl
        }
      });
    }
  }, [client, data, error, loading]);
  if (loading) {
    return <Loader />;
  }
  const user = data && data.mUserInSession ? data.mUserInSession : null;
  return (
    <UserContext.Provider value={user}>
      <React.Suspense fallback={<Loader />}>
        <BrowserRouter>
          <Switch>
            {/* Public Routes */}
            <Route path="/" exact component={Index} />
            <Route path="/login" exact component={Login} />
            <Route path="/categories/:categorySlug" exact component={Index} />
            <Route path="/issue/:id" component={ViewIssue} />
            <Redirect to="/" />
          </Switch>
          <GlobalStyle />
        </BrowserRouter>
      </React.Suspense>
    </UserContext.Provider>
  );
};

export default App;
