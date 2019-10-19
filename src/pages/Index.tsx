import React from 'react';

import Layout, { AppContext } from '../components/Layout';
import Issues, { IssuesView } from '../components/Issues';

const AppIndex: React.FC = () => {
  return (
    <Layout>
      <AppContext.Consumer>
        {context => (
          <Issues categoryId={context.categoryId} view={IssuesView.LIST} />
        )}
      </AppContext.Consumer>
    </Layout>
  );
};

export default AppIndex;
