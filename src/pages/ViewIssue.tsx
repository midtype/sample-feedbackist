import React from 'react';
import { useParams, Redirect } from 'react-router-dom';

import Layout from '../components/Layout';
import IssueSingle from '../components/IssueSingle';
import Loader from '../components/Loader';
import { useQuery } from '../utils/hooks';

const GET_ISSUE = `
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
  const { data, error } = useQuery<IIssueQuery>(GET_ISSUE, { issueId });
  if (!data) {
    return <Loader />;
  }
  if (error || !data) {
    return <Redirect to="/" />;
  }
  const issue = data.issue;
  return (
    <Layout>
      <IssueSingle issue={issue} />
    </Layout>
  );
};

export default ViewIssue;
