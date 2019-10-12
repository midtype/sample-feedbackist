import React from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import GET_CURRENT_USER from '../apollo/queries/currentUser';
import Loader from '../components/Loader';
import Layout from '../components/marketing/MarketingLayout';

const IndexPage: React.FC = () => {
  const { data, loading, error } = useQuery<{ mUserInSession: IUser }>(
    GET_CURRENT_USER
  );
  if (loading) {
    return <Loader />;
  }
  if (error || !data) {
    return <Redirect to="/" />;
  }
  return (
    <Layout>
      <h1>Hello, {data.mUserInSession.private.name}!</h1>
    </Layout>
  );
};

export default IndexPage;
