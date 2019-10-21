import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/react-hooks';

import Issue from './Issue';
import Button from './Button';
import IconImage from './IconImage';
import IssueComments from './IssueComments';

import { UserContext } from '../App';
import { AppContext } from './Layout';
import { uploadFile } from '../utils';

interface IIssueSingleProps {
  issue: IIssue;
}

interface ICreateCommentProps {
  issueId: string;
  openLogin: () => void;
  userId?: string;
  commentId?: string;
}

const CREATE_COMMENT = gql`
  mutation CreateComment(
    $text: String!
    $commenterId: UUID!
    $parentCommentId: UUID
    $issueId: UUID!
    $imageId: UUID
  ) {
    createComment(
      input: {
        comment: {
          text: $text
          commenterId: $commenterId
          parentCommentId: $parentCommentId
          issueId: $issueId
          imageId: $imageId
        }
      }
    ) {
      comment {
        id
        text
      }
    }
  }
`;

const Styled = styled.div`
  width: 100%;
  max-width: 60rem;
  margin: auto;
  margin-top: 5rem;
  .leave-comment textarea {
    background: white;
    width: 100%;
    border: 1px solid lightgray;
    outline: none;
    padding: 0.5rem;
    border-radius: 0;
    resize: none;
  }
  .leave-comment__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }
  .leave-comment__upload__input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .leave-comment__upload__label {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .leave-comment__upload__label__icon {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    height: 3rem;
    width: 3rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
  }
  .leave-comment__upload__label__icon svg {
    width: 1rem;
    height: 1rem;
    fill: gray;
  }
`;

const CreateComment: React.FC<ICreateCommentProps> = props => {
  const client = useApolloClient();
  const { userId, issueId, openLogin, commentId } = props;

  const [text, setText] = useState('');
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!userId) {
      openLogin();
      return;
    }
    setLoading(true);
    try {
      const imageId = image ? await uploadFile(image) : undefined;
      const variables = {
        text,
        commenterId: userId,
        parentCommentId: commentId || undefined,
        issueId,
        imageId
      };
      await client.mutate({
        mutation: CREATE_COMMENT,
        variables,
        refetchQueries: ['GetComments'],
        awaitRefetchQueries: true
      });
      setText('');
      setImage(undefined);
    } catch (e) {
      // Do something with the error here.
      console.log(e);
    }
    setLoading(false);
  }, [image, text, userId, commentId, issueId, client, openLogin]);

  return (
    <div className="leave-comment">
      <textarea
        className="leave-comment__text"
        placeholder="Leave a comment"
        value={text}
        onChange={e => setText(e.target.value)}
      ></textarea>
      <div className="leave-comment__footer">
        <div className="leave-comment__upload">
          <input
            type="file"
            name="file"
            id="file"
            accept=".png, .jpg, .jpeg"
            className="leave-comment__upload__input"
            onChange={e => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }
            }}
          ></input>
          <label htmlFor="file" className="leave-comment__upload__label">
            <div className="leave-comment__upload__label__icon">
              <IconImage />
            </div>
            {image && <p>{image.name}</p>}
          </label>
        </div>
        <Button loading={loading} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

const IssuesList: React.FC<IIssueSingleProps> = props => {
  const { issue } = props;
  return (
    <Styled>
      <Issue {...issue} />
      <AppContext.Consumer>
        {context => (
          <UserContext.Consumer>
            {user => (
              <CreateComment
                issueId={issue.id}
                openLogin={context.toggleLoginModal}
                userId={user ? user.id : undefined}
              />
            )}
          </UserContext.Consumer>
        )}
      </AppContext.Consumer>
      <IssueComments issueId={issue.id} />
    </Styled>
  );
};

export default IssuesList;
