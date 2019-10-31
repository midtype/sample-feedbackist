import React from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';

import { categoryBackground } from '../utils';
import { useQuery } from '../utils/hooks';

const GET_CATEGORIES = `
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

const Category: React.FC<ICategory & { active: boolean }> = props => {
  const background = categoryBackground(props);
  return (
    <Link to={props.slug ? `/categories/${props.slug}` : '/'}>
      <div
        className={`category category--${props.active ? 'active' : 'inactive'}`}
      >
        <div className="category__emoji">{props.emoji}</div>
        <h5 className="category__name">{props.name}</h5>
        <div className="category__background" style={{ background }} />
      </div>{' '}
    </Link>
  );
};

const CategoriesList: React.FC = () => {
  const { categorySlug } = useParams();
  const { data, error } = useQuery<ICategoriesQuery>(GET_CATEGORIES);

  if (error || !data) {
    return null;
  }
  return (
    <Styled>
      <Category {...ALL_CATEGORY} active={!categorySlug} />
      {data.categories.nodes.map(category => (
        <Category
          key={category.id}
          {...category}
          active={categorySlug === category.slug}
        />
      ))}
    </Styled>
  );
};

export default CategoriesList;
