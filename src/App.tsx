import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/react-hooks';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import CategoryIssues from './pages/CategoryIssues';
import Login from './pages/Login';
import ViewIssue from './pages/ViewIssue';
import Roadmap from './pages/Roadmap';

import GlobalStyle from './components/GlobalStyle';
import { useQuery } from './utils/hooks';

export const UserContext = React.createContext<IUser | null | undefined>(
  undefined
);

const GET_CURRENT_USER = `
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
  const { data, error } = useQuery<{ mUserInSession: IUser }>(GET_CURRENT_USER);
  const client = useApolloClient();
  useEffect(() => {
    if (
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
  }, [client, data, error]);
  const user =
    data && data.mUserInSession ? data.mUserInSession : data ? null : undefined;
  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Switch>
          {/* Public Routes */}
          <Route path="/" exact component={Roadmap} />
          <Route path="/login" exact component={Login} />
          <Route path="/categories/:categorySlug" component={CategoryIssues} />
          <Route path="/issue/:id" component={ViewIssue} />
          <Redirect to="/" />
        </Switch>
        <GlobalStyle />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
