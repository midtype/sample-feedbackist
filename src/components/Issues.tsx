import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';

import CategoryHeading from './CategoryHeading';
import Loader from './Loader';
import Issue from './Issue';
import IssueCreate from './IssueCreate';

interface IIssuesProps {
  categorySlug: string;
}

const ISSUE_FRAGMENT = gql`
  fragment IssueFragment on Issue {
    createdAt
    id
    summary
    description
    voteCount
    category {
      id
      name
      hex
    }
    requestor {
      id
      metadatumByUserId {
        id
        name
        photoUrl
        photo {
          id
          location
        }
      }
    }
    image {
      id
      location
    }
    issueStatusByIssueId {
      id
      status {
        id
        name
      }
    }
    comments {
      totalCount
    }
  }
`;

const GET_ISSUES_ALL = gql`
  query GetIssuesAll {
    issues(first: 100, orderBy: [VOTE_COUNT_DESC, CREATED_AT_DESC]) {
      nodes {
        ...IssueFragment
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

const GET_ISSUES_BY_CATEGORY = gql`
  query GetIssuesByCategory($categorySlug: String!) {
    categoryBySlug(slug: $categorySlug) {
      id
      issues(first: 100, orderBy: [VOTE_COUNT_DESC, CREATED_AT_DESC]) {
        nodes {
          ...IssueFragment
        }
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

const Styled = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 3rem;
  .empty {
    background: white;
    padding: 2rem;
    text-align: center;
    border: 1px solid lightgray;
  }
  .empty h3 {
    margin-bottom: 0.5rem;
  }
`;

const EmptyState: React.FC = () => (
  <div className="empty">
    <h3>No Issues to Report</h3>
    <p>
      Be the first to holler at the {process.env.REACT_APP_MY_APP_NAME || ''}{' '}
      team about any bugs you notice, or any features you'd like to see!
    </p>
  </div>
);

const Issues: React.FC<IIssuesProps> = props => {
  const { categorySlug } = props;
  const issuesAll = useQuery(GET_ISSUES_ALL, {
    skip: categorySlug ? true : false
  });
  const issuesByCat = useQuery(GET_ISSUES_BY_CATEGORY, {
    variables: { categorySlug },
    skip: categorySlug ? false : true
  });
  if (
    (issuesAll.loading && !issuesAll.data) ||
    (issuesByCat.loading && !issuesByCat.data)
  ) {
    return <Loader />;
  }
  if (issuesAll.error || issuesByCat.error) {
    return null;
  }
  const issues = categorySlug
    ? issuesByCat.data.categoryBySlug.issues.nodes
    : issuesAll.data.issues.nodes;
  return (
    <React.Fragment>
      <Styled>
        <div className="issues__create">
          <CategoryHeading categorySlug={categorySlug} />
          <IssueCreate categorySlug={categorySlug} />
        </div>
        <div className="issues__list">
          {issues.length === 0 && <EmptyState />}
          {issues.map((issue: IIssue) => (
            <Link to={`/issue/${issue.id}`} key={issue.id}>
              <Issue {...issue} />
            </Link>
          ))}
        </div>
      </Styled>
    </React.Fragment>
  );
};

export default Issues;
