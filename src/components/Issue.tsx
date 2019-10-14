import React, { useCallback } from 'react';
import styled from 'styled-components';
import time from 'timeago.js';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Avatar from './UserAvatar';
import { UserContext } from '../App';
import { hexToRGB, categoryBackground } from '../utils';

const VOTE_BOX_WIDTH = '4rem';

const ISSUE_VOTE_FRAGMENT = gql`
  fragment IssueVoteFragment on MUser {
    id
    issueVotesByUserId {
      nodes {
        id
        user {
          id
        }
        issue {
          id
        }
      }
    }
  }
`;

const GET_USER_VOTES = gql`
  query GetUserInSessionVotes {
    mUserInSession {
      ...IssueVoteFragment
    }
  }
  ${ISSUE_VOTE_FRAGMENT}
`;

interface IGetUserVotesQuery {
  mUserInSession: { issueVotesByUserId: { nodes: IIssueVote[] } };
}

const ADD_VOTE = gql`
  mutation UpvoteIssue($issueId: UUID!, $userId: UUID!) {
    createIssueVote(
      input: { issueVote: { issueId: $issueId, userId: $userId } }
    ) {
      user {
        ...IssueVoteFragment
      }
      issue {
        id
        voteCount
      }
    }
  }
  ${ISSUE_VOTE_FRAGMENT}
`;

const DELETE_VOTE = gql`
  mutation DeleteVoteFromIssue($voteId: UUID!) {
    deleteIssueVote(input: { id: $voteId }) {
      user {
        ...IssueVoteFragment
      }
      issue {
        id
        voteCount
      }
    }
  }
  ${ISSUE_VOTE_FRAGMENT}
`;

const Styled = styled.div`
  background: white;
  padding: 1rem;
  padding-top: 1.5rem;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border-top: 3px solid #f8e71c;
  display: grid;
  grid-template-columns: ${VOTE_BOX_WIDTH} auto;
  grid-gap: 1rem;
  max-width: 40rem;
  margin: auto;
  margin-bottom: 2rem;
  .votes {
    width: ${VOTE_BOX_WIDTH};
    height: ${VOTE_BOX_WIDTH};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    border: 1px solid gray;
    border-radius: 3px;
    opacity: 0.5;
    transition: 250ms all;
    cursor: pointer;
  }
  .votes--voted {
    background: rgba(248, 231, 28, 0.2);
    border: 1px solid rgba(248, 231, 28, 1);
    opacity: 1;
  }
  .votes:hover {
    opacity: 1;
  }
  .votes h3 {
    color: black;
  }
  .votes__arow {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid black;
    margin-bottom: 0.25rem;
  }
  .metadata {
    margin-top: 1rem;
    grid-area: 2 / 1 / 2 / 3;
    display: flex;
    justify-content: space-between;
  }
  .metadata__user,
  .metadata__category {
    display: flex;
    align-items: center;
  }
  .metadata__user p {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.6);
  }
  .metadata__user__name {
    margin-left: 1rem;
  }
  .metadata__category__pill {
    padding: 0 0.75rem;
    height: 1.5rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
  }
`;

interface IVoteDisplayProps {
  user: null | IUser;
  issue: IIssue;
}

const VoteDisplay: React.FC<IVoteDisplayProps> = props => {
  const { issue, user } = props;
  const { data } = useQuery<IGetUserVotesQuery>(GET_USER_VOTES);
  const vote =
    data && data.mUserInSession
      ? data.mUserInSession.issueVotesByUserId.nodes.find(
          vote => vote.issue.id === issue.id
        )
      : null;
  const [voteMutation] = useMutation(vote ? DELETE_VOTE : ADD_VOTE, {
    variables: {
      issueId: issue.id,
      userId: user ? user.id : undefined,
      voteId: vote ? vote.id : undefined
    }
  });
  const onClick = useCallback(() => {
    if (user) {
      voteMutation();
    }
  }, [user, voteMutation]);
  return (
    <div
      className={`votes votes--${vote ? 'voted' : 'unvoted'}`}
      onClick={onClick}
    >
      <div className="votes__arow" />
      <h3>{issue.voteCount}</h3>
    </div>
  );
};

const Issue: React.FC<IIssue> = props => {
  const { requestor } = props;
  const { r, g, b } = hexToRGB(props.category.hex);
  const background = categoryBackground(props.category);
  return (
    <Styled>
      <UserContext.Consumer>
        {user => <VoteDisplay user={user} issue={props} />}
      </UserContext.Consumer>
      <h4 className="summary">{props.summary}</h4>
      <div className="metadata">
        <div className="metadata__user">
          {requestor.metadatumByUserId && (
            <React.Fragment>
              <Avatar user={requestor} diameter={30} />
              <p className="metadata__user__name">
                <strong>
                  {requestor.metadatumByUserId
                    ? requestor.metadatumByUserId.name
                    : null}
                </strong>
                &nbsp;•&nbsp;
              </p>
            </React.Fragment>
          )}
          <p>
            {time().format(new Date(props.createdAt))}&nbsp;•&nbsp;
            {props.comments.totalCount || 'No'} Comments
          </p>
        </div>
        <div className="metadata__category">
          <div
            className="metadata__category__pill"
            style={{ background, color: `rgb(${r},${g},${b})` }}
          >
            {props.category.name}
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Issue;
