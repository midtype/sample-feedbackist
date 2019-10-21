import React from 'react';
import gql from 'graphql-tag';
import { useParams, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import Layout from '../components/Layout';
import CategoryHeading from '../components/CategoryHeading';
import IssueSingle from '../components/IssueSingle';
import Loader from '../components/Loader';

const GET_ISSUE = gql`
  query GetIssue($issueId: UUID!) {
    issue(id: $issueId) {
      createdAt
      id
      summary
      description
      voteCount
      category {
        id
        slug
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
      comments {
        totalCount
      }
    }
  }
`;

interface IIssueQuery {
  issue: IIssue;
}

const ViewIssue: React.FC = () => {
  const { id: issueId } = useParams();
  const { data, loading, error } = useQuery<IIssueQuery>(GET_ISSUE, {
    variables: { issueId }
  });
  if (loading && !data) {
    return <Loader />;
  }
  if (error || !data) {
    return <Redirect to="/" />;
  }
  const issue = data.issue;
  return (
    <Layout>
      <CategoryHeading categorySlug={issue.category.slug} />
      <IssueSingle issue={issue} />
    </Layout>
  );
};

export default ViewIssue;
