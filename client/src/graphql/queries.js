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

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: createJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
    update: (caches, { data }) => {
      caches.writeQuery({
        query: getJobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return data.job;
}
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

export async function getJobs() {
  const query = gql`
    query jobs {
      jobs {
        date
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only',
  });
  return data.jobs;
}

const getJobByIdQuery = gql`
  query getJob($jobId: ID!) {
    job(id: $jobId) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export async function getJob(jobId) {
  const { data } = await apolloClient.query({
    query: getJobByIdQuery,
    variables: { jobId },
  });
  return data.job;
}
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

export async function getCompanyById(companyId) {
  const { data } = await apolloClient.query({
    query: companyByIdQuery,
    variables: { companyId },
  });

  return data.company;
}
