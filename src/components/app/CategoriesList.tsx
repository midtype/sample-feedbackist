import React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import Loader from '../Loader';
import CategoryEmoji from './CategoryEmoji';
import { categoryBackground } from '../../utils';

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
  .categories {
    margin-top: 1rem;
  }
  .category {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    border-radius: 1.5rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
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
    margin-left: 1rem;
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
  .category:hover .category__background {
    opacity: 1;
  }
`;

const Category: React.FC<ICategory> = props => {
  const background = categoryBackground(props);
  return (
    <div className="category">
      <CategoryEmoji category={props} font="1.5rem" diameter="3rem" />
      <h3 className="category__name">{props.name}</h3>
      <div className="category__background" style={{ background }} />
    </div>
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
      <label>Categories</label>
      <div className="categories">
        <Category id="0" hex="#000000" name="ALL" emoji="🌍" slug="" />
        {data.categories.nodes.map(category => (
          <Category key={category.id} {...category} />
        ))}
      </div>
    </Styled>
  );
};

export default CategoriesList;
