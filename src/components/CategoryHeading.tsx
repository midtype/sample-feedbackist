import React, { useMemo } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Loader from './Loader';
import Toggle from './Toggle';
import CategoryEmoji from './CategoryEmoji';
import { ALL_CATEGORY } from './CategoriesList';
import UserAvatar from './UserAvatar';

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
        issues {
          totalCount
          nodes {
            id
            requestor {
              id
              metadatumByUserId {
                id
                photo {
                  id
                  location
                }
                photoUrl
              }
            }
          }
        }
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
  .title__count,
  .title__contributors {
    margin-left: 1rem;
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.8rem;
  }
  .title__contributors {
    display: flex;
    align-items: baseline;
  }
  .title__contributors__avatar {
    position: relative;
    margin-right: -0.25rem;
    bottom: -0.5rem;
  }
  .title__contributors__additional {
    margin-left: 1rem;
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

const CONTRIBUTORS_LIMIT = 4;

const CategoryContributors: React.FC<{
  totalCount: number;
  nodes: IIssue[];
}> = props => {
  const { nodes, totalCount } = props;
  const contributors = useMemo(() => {
    const dict: { [id: string]: IUser } = {};
    nodes.forEach(issue => {
      const user = issue.requestor;
      dict[user.id] = user;
    });
    return dict;
  }, [nodes]);
  return (
    <React.Fragment>
      <div className="title__count">{totalCount} issues.</div>
      <div className="title__contributors">
        {Object.keys(contributors)
          .slice(0, CONTRIBUTORS_LIMIT)
          .map(id => (
            <UserAvatar
              key={id}
              user={contributors[id]}
              diameter={25}
              className="title__contributors__avatar"
            />
          ))}
        <span className="title__contributors__additional">
          {Object.keys(contributors).length} contributors.
        </span>
      </div>
    </React.Fragment>
  );
};

const CategoryTitle: React.FC<ICategory> = props => {
  return (
    <div className="title">
      <CategoryEmoji category={props} font="2rem" diameter="5rem" />
      <h1 className="title__text">{props.name}</h1>
      {props.issues && <CategoryContributors {...props.issues} />}
    </div>
  );
};

const CategoryFilters: React.FC = () => {
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
  const { data, loading, error } = useQuery<ICategoryQuery>(GET_CATEGORIES);
  if (loading) {
    return <Loader />;
  }
  if (error || !data) {
    return null;
  }
  const category =
    data.categories.nodes.find(category => category.id === categoryId) ||
    ALL_CATEGORY;
  console.log(category);
  return (
    <Styled>
      <CategoryTitle {...category} />
      <CategoryFilters />
    </Styled>
  );
};

export default CategoryHeading;
