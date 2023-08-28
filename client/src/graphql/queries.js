import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  gql,
  concat,
  InMemoryCache,
} from '@apollo/client';
import { getAccessToken } from '../lib/auth';

const graphql_endpoint = 'http://localhost:9000/graphql';
const httpLink = createHttpLink({ uri: graphql_endpoint });

const authLink = new ApolloLink((operation, forward) => {
  console.log('[customLink] operation', operation);
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;
export const createJobMutation = gql`
  mutation CreateJob($input: createJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const jobsQuery = gql`
  query Query($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        title
        date
        description
        company {
          name
          description
        }
      }
      totalCount
    }
  }
`;

export const getJobByIdQuery = gql`
  query getJob($jobId: ID!) {
    job(id: $jobId) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
  query getCompany($companyId: ID!) {
    company(id: $companyId) {
      id
      name
      description
      jobs {
        id
        date
        title
        description
      }
    }
  }
`;
