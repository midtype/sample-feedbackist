import React, { useMemo } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Loader from './Loader';
import { ALL_CATEGORY } from './CategoriesList';
import UserAvatar from './UserAvatar';

interface ICategoryHeadingProps {
  categorySlug?: string;
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
  margin-bottom: 2rem;

  .title__count,
  .title__contributors {
    color: rgba(0, 0, 0, 0.6);
  }

  .title__contributors {
    margin-left: 1rem;
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
      <div className="title__count">
        {totalCount} {`issue${totalCount > 1 ? 's' : ''}`}.
      </div>
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
          {Object.keys(contributors).length}{' '}
          {`contributor${Object.keys(contributors).length > 1 ? 's' : ''}`}.
        </span>
      </div>
    </React.Fragment>
  );
};

const CategoryHeading: React.FC<ICategoryHeadingProps> = props => {
  const { categorySlug } = props;
  const { data, loading, error } = useQuery<ICategoryQuery>(GET_CATEGORIES);
  if (loading) {
    return <Loader />;
  }
  if (error || !data) {
    return null;
  }
  const category =
    data.categories.nodes.find(category => category.slug === categorySlug) ||
    ALL_CATEGORY;
  return (
    <Styled>
      {category.issues && category.issues.totalCount > 0 && (
        <CategoryContributors {...category.issues} />
      )}
    </Styled>
  );
};

export default CategoryHeading;
