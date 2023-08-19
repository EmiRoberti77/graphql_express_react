import { GraphQLClient, gql } from 'graphql-request';

const graphql_endpoint = 'http://localhost:9000/graphql';

const client = new GraphQLClient(graphql_endpoint);

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
