import React from 'react';
import { useParams } from 'react-router-dom';

import Layout from '../components/Layout';
import Issues from '../components/Issues';

const AppIndex: React.FC = () => {
  const { categorySlug } = useParams();
  return (
    <Layout>
      <Issues categorySlug={categorySlug} />
    </Layout>
  );
};

export default AppIndex;
