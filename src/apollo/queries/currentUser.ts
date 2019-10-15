import gql from 'graphql-tag';

export default gql`
  {
    mUserInSession {
      id
      private {
        name
        email
        photoUrl
      }
    }
  }
`;
