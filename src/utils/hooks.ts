import { GraphQLClient } from 'graphql-request';
import useSWR from '@zeit/swr';
import { getJWT, clearJWT } from './jwt';

const jwt = getJWT();

const client = new GraphQLClient(
  process.env.REACT_APP_MY_APP_ENDPOINT as string,
  {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
  }
);

export const useQuery = <T>(q: string, variables?: any) =>
  useSWR<T>(q, () => client.request(q, variables));
