import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import Layout from '../components/Layout';
import Issue from '../components/Issue';
import * as colors from '../utils/colors';

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

const GET_ISSUES = gql`
  query GetIssuesByStatus($slug: String!) {
    statusBySlug(slug: $slug) {
      id
      name
      issueStatuses {
        nodes {
          issue {
            ...IssueFragment
          }
        }
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

const Styled = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 3rem;

  .status__title {
    display: flex;
    align-items: baseline;
  }
  .status__count {
    font-size: 1rem;
    color: ${colors.GRAY_3()};
    background: ${colors.GRAY_2()};
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-weight: bold;
    margin-left: 0.5rem;
  }
  .status__issues {
    width: 100%;
    min-height: 50vh;
    max-height: calc(100vh - 15rem);
    overflow-y: auto;
    background: ${colors.GRAY_1()};
    border-radius: 5px;
    margin-top: 2rem;
    padding: 1rem;
  }
  .status__issues .issue {
    margin-bottom: 1rem;
  }
`;

const StatusColumn: React.FC<any> = props => {
  const { data } = useQuery<{ statusBySlug: IStatus }>(GET_ISSUES, {
    variables: { slug: props.slug }
  });
  const statuses = data ? data.statusBySlug.issueStatuses.nodes : [];
  return (
    <div className="status status--future">
      <div className="status__title">
        <h4>{props.title}</h4>
        <div className="status__count">{statuses.length}</div>
      </div>
      <div className="status__issues">
        {statuses.map(status => (
          <Link to={`/issue/${status.issue.id}`} key={status.issue.id}>
            <Issue {...status.issue} />
          </Link>
        ))}
      </div>
    </div>
  );
};

const Roadmap: React.FC = () => {
  return (
    <Layout>
      <Styled>
        <StatusColumn slug="future" title="Future" />
        <StatusColumn slug="in-progress" title="In Progress" />
        <StatusColumn slug="completed" title="Completed" />
      </Styled>
    </Layout>
  );
};

export default Roadmap;
