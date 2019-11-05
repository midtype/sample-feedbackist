import React from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';

import * as colors from '../utils/colors';
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
    padding: 0.25rem 0;
    margin: 0 1rem;
    cursor: pointer;
    transition: 250ms all;
    color: ${colors.GRAY_3()};
    opacity: 0.6;
  }
  .category--active {
    color: ${colors.PURPLE_DARK()};
  }
  .category:hover,
  .category--active {
    opacity: 1;
  }
  .category--roadmap {
    padding-right: 2.5rem;
    margin-right: 1.5rem;
    border-right: 1px solid ${colors.GRAY_2()};
  }
  .category__name {
    margin: 0;
    color: inherit;
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
`;

export const ALL_CATEGORY: ICategory = {
  id: '',
  name: 'Roadmap',
  hex: '#000000',
  emoji: '🌍',
  slug: 'roadmap'
};

const Category: React.FC<
  ICategory & { link: string; active: boolean }
> = props => {
  return (
    <Link to={props.link}>
      <div
        className={`category category--${
          props.active ? 'active' : 'inactive'
        } category--${props.slug}`}
      >
        <h5 className="category__name">{props.name}</h5>
      </div>{' '}
    </Link>
  );
};

const CategoriesList: React.FC = () => {
  const { categorySlug } = useParams();
  const { data, error } = useQuery<ICategoriesQuery>(GET_CATEGORIES);

  if (error || !data) {
    return <Styled />;
  }

  return (
    <Styled>
      <Category {...ALL_CATEGORY} active={!categorySlug} link="/" />
      {data.categories.nodes.map(category => (
        <Category
          key={category.id}
          {...category}
          active={categorySlug === category.slug}
          link={`/categories/${category.slug}`}
        />
      ))}
    </Styled>
  );
};

export default CategoriesList;
