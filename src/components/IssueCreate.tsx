import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useApolloClient } from '@apollo/react-hooks';

import Button from './Button';
import IconImage from './IconImage';

import { AppContext } from './Layout';
import { UserContext } from '../App';
import { getJWT } from '../utils/jwt';

const CREATE_ISSUE = gql`
  mutation CreateIssue(
    $categoryId: UUID!
    $summary: String!
    $userId: UUID!
    $description: String
    $imageId: UUID
  ) {
    createIssue(
      categoryId: $categoryId
      summary: $summary
      description: $description
      requestorId: $userId
      imageId: $imageId
    ) {
      clientMutationId
    }
  }
`;

const Styled = styled.div`
  width: 100%;
  border-radius: 5px;
  border: 1px solid smokegray;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border-top: 3px solid #f8e71c;

  .create__input {
    display: flex;
    flex-flow: column;
    margin: 1.5rem 0;
  }
  .create__input input,
  .create__input textarea {
    margin-top: 0.5rem;
    border: 1px solid smokegray;
    outline: none;
    padding: 0.5rem;
  }
  .create__input .required {
    color: red;
    font-weight: bold;
    margin-left: 0.25rem;
  }
  .create__image__input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .create__image__preview {
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    border: 1px dashed gray;
    cursor: pointer;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .create__image__preview svg {
    width: 1rem;
    height: 1rem;
    fill: gray;
    margin-right: 0.5rem;
    margin-top: -1px;
  }
`;

interface IIssueCreateFormProps {
  categoryId: string;
  userId?: string;
}

const uploadFile = async (file: Blob) => {
  const body = new FormData();
  body.append('asset', file);
  const asset = await fetch('https://api-staging.midtype.com/upload', {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${getJWT()}` }
  }).then(res => res.json());
  return asset.asset_id;
};

const ImagePreview: React.FC<{ file: Blob }> = props => {
  const { file } = props;
  return (
    <div className="create__image__preview">
      <IconImage />
      <label>Upload Screenshot</label>
    </div>
  );
};

const IssueCreateForm: React.FC<IIssueCreateFormProps> = props => {
  const { categoryId, userId } = props;
  const client = useApolloClient();

  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState();

  const onSubmit = useCallback(async () => {
    const imageId = image ? await uploadFile(image) : undefined;
    const variables = {
      categoryId,
      summary,
      userId,
      description,
      imageId
    };
    console.log(imageId);
  }, [image, categoryId, summary, userId, description]);

  return (
    <Styled>
      <h3>Submit Feedback</h3>
      <div className="create__input">
        <label>
          Summary<span className="required">*</span>
        </label>
        <input></input>
      </div>
      <div className="create__input">
        <label>Description</label>
        <textarea
          value={summary}
          onChange={e => setSummary(e.target.value)}
        ></textarea>
      </div>
      <div className="create__input">
        <input
          type="file"
          name="file"
          id="file"
          accept=".png, .jpg, .jpeg"
          onChange={e => {
            if (e.target.files) {
              setImage(e.target.files[0]);
            }
          }}
          className="create__image__input"
        ></input>
        <label htmlFor="file" className="create__image__label">
          <ImagePreview file={image} />
        </label>
      </div>
      <Button onClick={onSubmit}>Submit</Button>
    </Styled>
  );
};

const IssueCreate: React.FC = () => {
  return (
    <AppContext.Consumer>
      {context => (
        <UserContext.Consumer>
          {user => (
            <IssueCreateForm
              categoryId={context.categoryId}
              userId={user ? user.id : undefined}
            />
          )}
        </UserContext.Consumer>
      )}
    </AppContext.Consumer>
  );
};

export default IssueCreate;
