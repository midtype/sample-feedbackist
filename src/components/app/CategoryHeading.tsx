import React from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import Loader from '../Loader';
import CategoryEmoji from './CategoryEmoji';

interface ICategoryHeadingProps {
  slug: string;
}

const GET_CATEGORY = gql`
  query GetCategory($slug: String!) {
    categoryBySlug(slug: $slug) {
      id
      name
      emoji
      hex
      slug
    }
  }
`;

interface ICategoryQuery {
  categoryBySlug: ICategory;
}

const Styled = styled.div``;

const CategoryTitle: React.FC<ICategory> = props => {
  return (
    <div className="title">
      <CategoryEmoji category={props} font="2rem" diameter="5rem" />
      <h1 className="title__text">{props.name}</h1>
      <div className="title__contributors">+23 more</div>
    </div>
  );
};

const CategoryHeading: React.FC<ICategoryHeadingProps> = props => {
  const { slug } = props;
  const { data, loading, error } = useQuery<ICategoryQuery>(GET_CATEGORY, {
    variables: { slug }
  });
  if (loading) {
    return <Loader />;
  }
  if (error || !data) {
    return null;
  }
  const category = data.categoryBySlug;
  return (
    <Styled>
      <CategoryTitle {...category} />
    </Styled>
  );
};

export default CategoryHeading;
