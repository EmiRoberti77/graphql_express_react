import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { GraphQLClient } from 'graphql-request';
import { getAccessToken } from '../lib/auth';

const graphql_endpoint = 'http://localhost:9000/graphql';

const client = new GraphQLClient(graphql_endpoint, {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    } else return {};
  },
});

const apolloClient = new ApolloClient({
  uri: graphql_endpoint,
  cache: new InMemoryCache(),
});

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: createJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { job } = await client.request(mutation, {
    input: { title, description },
  });
  return job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        date
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await apolloClient.query({ query });
  return data.jobs;
  //const { jobs } = await client.request(query);
  //return jobs;
}

export async function getJob(jobId) {
  const query = gql`
    query getJob($jobId: ID!) {
      job(id: $jobId) {
        id
        date
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
    variables: { jobId },
  });
  return data.job;
}

export async function getCompanyById(companyId) {
  const query = gql`
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

  const { data } = await apolloClient.query({
    query,
    variables: { companyId },
  });

  return data.company;
}
