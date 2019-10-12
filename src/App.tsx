import React, { lazy, Suspense } from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import Index from './pages/Index';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Login from './pages/Login';

import GlobalStyle from './components/GlobalStyle';
import Loader from './components/Loader';
import GET_CURRENT_USER from './apollo/queries/currentUser';

const AppIndex = lazy(() => import('./pages/app/Index'));

/**
 * There are some routes in our app that we only want logged in users to be able to
 * access. For those routes, we wrap them in a GraphQL query that checks if the user
 * is currently logged in. Furthermore, we check to see if the user has an active
 * Stripe subscription, and if not, redirect them to the payment flow so that they
 * can create one. If not, we redirect them to the login page. To learn more about
 * the Apollo `<Query />` component, [see their documentation](https://www.apollographql.com/docs/react/essentials/queries/#the-query-component)
 */
const ProtectedRoutes: React.FC = () => {
  const { data, loading, error } = useQuery<{ mUserInSession: IUser }>(
    GET_CURRENT_USER
  );
  const isLoggedIn = data && data.mUserInSession;
  if (loading) {
    return <Loader />;
  }
  if (!isLoggedIn || error) {
    // If a non-logged user is trying to access the app, redirect them to the homepage.
    return <Redirect to="/" />;
  }
  return (
    <React.Fragment>
      <Route path="/app" exact component={AppIndex} />
    </React.Fragment>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Suspense fallback={<Loader />}>
          {/* Public Routes */}
          <Route path="/" exact component={Index} />
          <Route path="/about" exact component={About} />
          <Route path="/pricing" exact component={Pricing} />
          <Route path="/login" exact component={Login} />

          {/* Protected Routes */}
          <ProtectedRoutes />
        </Suspense>
      </Switch>
      <GlobalStyle />
    </Router>
  );
};

export default App;
