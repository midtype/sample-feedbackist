import React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import Loader from './Loader';
import Toggle from './Toggle';
import CategoryEmoji from './CategoryEmoji';
import { ALL_CATEGORY } from './CategoriesList';

interface ICategoryHeadingProps {
  categoryId?: string;
}

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      nodes {
        id
        name
        emoji
        hex
        slug
      }
    }
  }
`;

interface ICategoryQuery {
  categories: { nodes: ICategory[] };
}

const Styled = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  .title {
    display: flex;
    align-items: baseline;
  }
  .title__text {
    margin-left: 1.5rem;
  }
  .title__contributors {
    margin-left: 1rem;
    color: rgba(0, 0, 0, 0.4);
    font-size: 0.8rem;
  }
  .filters {
    display: flex;
  }
  .filters__group label {
    margin-right: 1rem;
  }
  .filters__group {
    display: flex;
    align-items: center;
    margin-right: 2rem;
  }
`;

const CategoryTitle: React.FC<ICategory> = props => {
  return (
    <div className="title">
      <CategoryEmoji category={props} font="2rem" diameter="5rem" />
      <h1 className="title__text">{props.name}</h1>
      <div className="title__contributors">+23 more participating.</div>
    </div>
  );
};

const CategoryFilters: React.FC<any> = props => {
  return (
    <div className="filters">
      <div className="filters__group filters__group--view">
        <label>View</label>
        <Toggle checked={true} />
      </div>
    </div>
  );
};

const CategoryHeading: React.FC<ICategoryHeadingProps> = props => {
  const { categoryId } = props;
  const { data, loading, error } = useQuery<ICategoryQuery>(GET_CATEGORIES, {
    variables: { categoryId }
  });
  if (loading) {
    return <Loader />;
  }
  if (error || !data) {
    return null;
  }
  const category =
    data.categories.nodes.find(category => category.id === categoryId) ||
    ALL_CATEGORY;
  return (
    <Styled>
      <CategoryTitle {...category} />
      <CategoryFilters />
    </Styled>
  );
};

export default CategoryHeading;
