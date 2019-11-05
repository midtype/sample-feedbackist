import React from 'react';

import CategoriesList from './CategoriesList';
import Nav from './NavBase';

const NavFeedback: React.FC = props => {
  return (
    <Nav title="Feedback">
      <CategoriesList />
    </Nav>
  );
};

export default NavFeedback;
