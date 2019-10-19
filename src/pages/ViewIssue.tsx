import React from 'react';

import Layout, { AppContext } from '../components/Layout';
import Issues, { IssuesView } from '../components/Issues';

const AppIndex: React.FC = () => {
  return (
    <Layout>
      <AppContext.Consumer>
        {context => (
          <React.Fragment>
            <Issues categoryId={context.categoryId} view={IssuesView.LIST} />
          </React.Fragment>
        )}
      </AppContext.Consumer>
    </Layout>
  );
};

export default AppIndex;
