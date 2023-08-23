import { GraphQLClient, gql } from 'graphql-request';
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
  const { jobs } = await client.request(query);
  return jobs;
}

export async function getJob(jobId) {
  const query = gql`
    query getJob($id: ID!) {
      job(id: $id) {
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

  const { job } = await client.request(query, { id: jobId });
  return job;
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

  const { company } = await client.request(query, { companyId });
  return company;
}
