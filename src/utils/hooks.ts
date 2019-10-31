import { request } from 'graphql-request';
import useSWR from '@zeit/swr';

export const useQuery = <T>(q: string, variables?: any) =>
  useSWR<T>(q, () =>
    request(process.env.REACT_APP_MY_APP_ENDPOINT as string, q, variables)
  );
