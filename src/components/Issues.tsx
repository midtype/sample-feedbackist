import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import CategoryHeading from './CategoryHeading';
import Loader from './Loader';
import Board from './IssuesBoard';
import List from './IssuesList';

import { UserContext } from '../App';
import { AppContext } from './Layout';

export enum IssuesView {
  BOARD = 'board',
  LIST = 'list'
}

interface IIssuesProps {
  categoryId?: string;
  view: IssuesView;
}

const ISSUE_FRAGMENT = gql`
  fragment IssueFragment on Issue {
    createdAt
    id
    summary
    description
    voteCount
    category {
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
        name
      }
    }
    comments {
      totalCount
    }
  }
`;

const GET_ISSUES_ALL = gql`
  query GetIssues {
    issues(first: 100, orderBy: [VOTE_COUNT_DESC, CREATED_AT_DESC]) {
      nodes {
        ...IssueFragment
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

const GET_ISSUES_BY_CATEGORY = gql`
  query GetIssues($categoryId: UUID) {
    issues(
      first: 100
      orderBy: [VOTE_COUNT_DESC, CREATED_AT_DESC]
      filter: { categoryId: { equalTo: $categoryId } }
    ) {
      nodes {
        ...IssueFragment
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

interface IIssuesQuery {
  issues: {
    nodes: IIssue[];
  };
}

const Issues: React.FC<IIssuesProps & { userId: string | null }> = props => {
  const { categoryId, view, userId } = props;
  const { data, loading, error } = useQuery<IIssuesQuery>(
    categoryId ? GET_ISSUES_BY_CATEGORY : GET_ISSUES_ALL,
    {
      variables: { categoryId, userId }
    }
  );
  if (loading) {
    return <Loader />;
  }
  if (error || !data) {
    return null;
  }
  const issues = data.issues.nodes;
  return (
    <React.Fragment>
      <AppContext.Consumer>
        {context => <CategoryHeading categoryId={context.categoryId} />}
      </AppContext.Consumer>
      {view === IssuesView.BOARD && <Board issues={issues} />}
      {view === IssuesView.LIST && <List issues={issues} />}
    </React.Fragment>
  );
};

const IssuesWithUser: React.FC<IIssuesProps> = props => (
  <UserContext.Consumer>
    {user => <Issues {...props} userId={user ? user.id : null} />}
  </UserContext.Consumer>
);

export default IssuesWithUser;
