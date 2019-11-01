import React, { useState, useCallback, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

import Button from './Button';
import Loader from './Loader';
import IconImage from './IconImage';
import IconCheck from './IconCheckCircle';

import { AppContext } from './Layout';
import { UserContext } from '../App';
import { uploadFile } from '../utils';

interface IIssueCreateProps {
  categorySlug?: string;
}

const GET_CATEGORY_ID = gql`
  query GetCategory($categorySlug: String!) {
    categoryBySlug(slug: $categorySlug) {
      id
      slug
    }
  }
`;

const CREATE_ISSUE = gql`
  mutation CreateIssue(
    $categoryId: UUID!
    $summary: String!
    $userId: UUID!
    $description: String
    $imageId: UUID
  ) {
    createIssue(
      input: {
        issue: {
          categoryId: $categoryId
          summary: $summary
          description: $description
          requestorId: $userId
          imageId: $imageId
        }
      }
    ) {
      issue {
        id
        summary
        description
        categoryId
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      nodes {
        id
        name
        emoji
        hex
        slug
      }
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
  position: relative;

  .create__input {
    display: flex;
    flex-flow: column;
    margin: 1.5rem 0;
  y}
  .create__input input,
  .create__input textarea,
  .create__input select {
    margin-top: 0.5rem;
    border: 1px solid lightgray;
    outline: none;
    padding: 0.5rem;
    border-radius: 0;
  }
  .create__input textarea {
    resize: none;
  }
  .create__input select {
    background: white;
    font-size: 1rem;
    font-weight: 600;
    appearance: none;
    &::-ms-expand {
      display: none;
    }
    &:hover {
      border-color: #888;
    }
    &:focus {
      border-color: #aaa;
      box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
      box-shadow: 0 0 0 3px -moz-mac-focusring;
      color: #222;
      outline: none;
    }
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
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    height: 3rem;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .create__image__preview--image {
    height: 8rem;
  }
  .create__image__preview img {
    width: 100%;
    opacity: 0.7;
  }
  .create__image__preview__empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .create__image__preview__empty svg {
    width: 1rem;
    height: 1rem;
    fill: gray;
    margin-right: 0.5rem;
    margin-top: -1px;
  }
  .create__success {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: 250ms all;
  }
  .create__success__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    opacity: 0;
    transform: scale(1.1);
    transition: 250ms all;
  }
  .create__success__content svg {
    fill: black;
    width: 2rem;
    height: 2rem;
    margin-bottom: 1.5rem;
  }
  .create__success--visible {
    opacity: 1;
    visibility: visible;
  }
  .create__success--visible .create__success__content {
    opacity: 1;
    transform: scale(1);
  }
`;

interface IIssueCreateFormProps {
  openLogin: () => void;
  categoryId?: string;
  userId?: string;
}

const ImagePreview: React.FC<{ file?: Blob }> = props => {
  const { file } = props;
  const [src, setSrc] = useState();
  const reader = useMemo(() => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (e.target) {
        setSrc(e.target.result);
      }
    };
    return reader;
  }, []);
  useEffect(() => {
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setSrc(undefined);
    }
  }, [file, reader]);
  return (
    <div
      className={`create__image__preview create__image__preview--${
        src ? 'image' : 'empty'
      }`}
    >
      {!src && (
        <div className="create__image__preview__empty">
          <IconImage />
          <label>Upload Screenshot</label>
        </div>
      )}
      {src && <img alt="Your screenshot to be uploaded" src={src} />}
    </div>
  );
};

const CategoryPicker: React.FC<{
  onChange: (id: string) => void;
  category: string;
}> = props => {
  const { category, onChange } = props;
  const { data, loading, error } = useQuery<{
    categories: { nodes: ICategory[] };
  }>(GET_CATEGORIES);

  if (loading || error || !data) {
    return <Loader />;
  }

  if (!category && data) {
    onChange(data.categories.nodes[0].id);
  }

  return (
    <select value={category} onChange={e => onChange(e.target.value)}>
      {data.categories.nodes.map(category => (
        <option key={category.id} value={category.id}>
          {category.emoji} {category.name}
        </option>
      ))}
    </select>
  );
};

const IssueCreateForm: React.FC<IIssueCreateFormProps> = props => {
  const { categoryId, userId, openLogin } = props;
  const client = useApolloClient();

  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categoryId || '');
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!userId) {
      openLogin();
      return;
    }
    setLoading(true);
    try {
      const imageId = image ? await uploadFile(image) : undefined;
      const variables = {
        categoryId: category,
        summary,
        userId,
        description,
        imageId
      };
      await client.mutate({
        mutation: CREATE_ISSUE,
        variables,
        refetchQueries: ['GetIssuesAll', 'GetIssuesByCategory'],
        awaitRefetchQueries: true
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSummary('');
        setDescription('');
        setCategory(categoryId || '');
        setImage(undefined);
      }, 3000);
    } catch (e) {
      // Do something with the error here.
      console.log(e);
    }
    setLoading(false);
  }, [
    image,
    category,
    categoryId,
    summary,
    userId,
    description,
    client,
    openLogin
  ]);

  return (
    <Styled>
      <h3>Submit Feedback</h3>
      {!categoryId && (
        <div className="create__input">
          <label>
            Feedback Category<span className="required">*</span>
          </label>
          <CategoryPicker
            category={category}
            onChange={id => setCategory(id)}
          />
        </div>
      )}
      <div className="create__input">
        <label>
          Summary<span className="required">*</span>
        </label>
        <input
          value={summary}
          onChange={e => setSummary(e.target.value)}
        ></input>
      </div>
      <div className="create__input">
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
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
      <Button loading={loading} onClick={onSubmit}>
        Submit
      </Button>
      <div
        className={`create__success create__success--${
          submitted ? 'visible' : ''
        }`}
      >
        <div className="create__success__content">
          <IconCheck />
          <h5>Feedback Successfully Submitted</h5>
        </div>
      </div>
    </Styled>
  );
};

const IssueCreate: React.FC<IIssueCreateProps> = props => {
  const { categorySlug } = props;
  const { data, loading, error } = useQuery(GET_CATEGORY_ID, {
    variables: { categorySlug },
    skip: categorySlug ? false : true
  });
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return null;
  }
  return (
    <AppContext.Consumer>
      {context => (
        <UserContext.Consumer>
          {user => (
            <IssueCreateForm
              categoryId={data ? data.categoryBySlug.id : undefined}
              userId={user ? user.id : undefined}
              openLogin={context.toggleLoginModal}
            />
          )}
        </UserContext.Consumer>
      )}
    </AppContext.Consumer>
  );
};

export default IssueCreate;
