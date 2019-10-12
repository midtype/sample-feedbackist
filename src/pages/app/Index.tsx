import React from 'react';

import Layout from '../../components/app/AppLayout';
import CategoryHeading from '../../components/app/CategoryHeading';

const AppIndex: React.FC = () => {
  return (
    <Layout>
      <CategoryHeading slug="features" />
    </Layout>
  );
};

export default AppIndex;
