import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import time from 'timeago.js';
import { useQuery } from '@apollo/react-hooks';

import Loader from './Loader';
import Avatar from './UserAvatar';

interface IIssueCommentProps {
  issueId: string;
}

interface IGetCommentsQuery {
  comments: {
    nodes: IComment[];
  };
}

const GET_COMMENTS = gql`
  query GetComments($issueId: UUID!) {
    comments(
      filter: {
        parentCommentId: { isNull: true }
        issueId: { equalTo: $issueId }
      }
    ) {
      nodes {
        id
        text
        createdAt
        image {
          id
          location
        }
        commenter {
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
      }
    }
  }
`;

const Styled = styled.div`
  width: 100%;

  .comment {
    margin-top: 3rem;
  }
  .comment__user {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  .comment__user__name {
    font-weight: bold;
    margin-left: 1rem;
  }
  .comment__text {
    display: flex;
  }
  .comment__text__image {
    flex: 0 0 120px;
    margin-right: 1rem;
  }
  .comment__text__image img {
    width: 100%;
  }
  .comment__meta {
    text-transform: capitalize;
  }
`;

const Comment: React.FC<IComment> = props => {
  const { text, commenter, image } = props;
  return (
    <div className="comment">
      <div className="comment__user">
        <Avatar user={commenter} diameter={25} />
        {commenter.metadatumByUserId && (
          <p className="comment__user__name">
            {commenter.metadatumByUserId.name}
          </p>
        )}
      </div>
      <div className="comment__text">
        {image && (
          <div className="comment__text__image">
            <img alt={text} src={image.location} />
          </div>
        )}
        <p>{text}</p>
      </div>
      <label className="comment__meta">
        {time().format(new Date(props.createdAt))}
      </label>
    </div>
  );
};

const IssueComments: React.FC<IIssueCommentProps> = props => {
  const { issueId } = props;
  const { data, loading, error } = useQuery<IGetCommentsQuery>(GET_COMMENTS, {
    variables: { issueId }
  });
  if (loading && !data) {
    return <Loader />;
  }
  if (error || !data) {
    return null;
  }
  return (
    <Styled>
      {data.comments.nodes.map(comment => (
        <Comment key={comment.id} {...comment} />
      ))}
    </Styled>
  );
};

export default IssueComments;
