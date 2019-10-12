import { gql } from 'apollo-boost';

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
