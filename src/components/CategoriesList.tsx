import React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import Loader from './Loader';
import { AppContext } from './Layout';
import { categoryBackground } from '../utils';

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

interface ICategoriesQuery {
  categories: { nodes: ICategory[] };
}

const Styled = styled.div`
  display: flex;
  justify-content: center;

  .category {
    margin: 0 1rem;
    display: flex;
    align-items: center;
    border-radius: 1.5rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    padding-right: 1rem;
  }
  .category__emoji {
    height: 3rem;
    width: 3rem;
    border-radius: 1.5rem;
    font-size: 1.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .category__name {
    margin: 0;
  }
  .category__background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: 250ms all;
  }
  .category:hover .category__background,
  .category--active .category__background {
    opacity: 1;
  }
`;

export const ALL_CATEGORY: ICategory = {
  id: '',
  name: 'All',
  hex: '#000000',
  emoji: '🌍',
  slug: ''
};

const Category: React.FC<ICategory> = props => {
  const background = categoryBackground(props);
  return (
    <AppContext.Consumer>
      {context => (
        <div
          className={`category category--${
            context.categoryId === props.id ? 'active' : 'inactive'
          }`}
          onClick={() => context.setCategoryId(props.id)}
        >
          <div className="category__emoji">{props.emoji}</div>
          <h5 className="category__name">{props.name}</h5>
          <div className="category__background" style={{ background }} />
        </div>
      )}
    </AppContext.Consumer>
  );
};

const CategoriesList: React.FC = () => {
  const { data, loading, error } = useQuery<ICategoriesQuery>(GET_CATEGORIES);
  if (loading) {
    return <Loader />;
  }
  if (error || !data) {
    return null;
  }
  return (
    <Styled>
      <Category {...ALL_CATEGORY} />
      {data.categories.nodes.map(category => (
        <Category key={category.id} {...category} />
      ))}
    </Styled>
  );
};

export default CategoriesList;
