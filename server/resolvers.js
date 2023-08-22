import { GraphQLError } from 'graphql';
import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
} from './db/jobs.js';
import { getCompany, getCompanies } from './db/companies.js';

export const resolvers = {
  Query: {
    companies: () => getCompanies(),
    company: async (_root, { id }) => {
      const response = await getCompany(id);
      if (!response) {
        throw notFound('no company found this id:' + id, 'NOT_FOUND');
      }
      return response;
    },
    job: async (_root, { id }) => {
      const response = await getJob(id);
      if (!response) {
        throw notFound('job not found for id:' + id, 'NOT_FOUND');
      }
      return response;
    },
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = 'FjcJCHJALA4i';
      const jobCreated = createJob({ companyId, title, description });
      return jobCreated;
    },
    deleteJob: (_root, { id }) => {
      const job = deleteJob(id);
      if (!job) throw notFound('job not found for id:' + id, 'NOT_FOUND');
      return job;
    },
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
};

const notFound = (msg, code) => {
  return new GraphQLError(msg, { extensions: { code } });
};

const toIsoDate = (value) => {
  return value.slice(0, 'yyyy-mm-dd'.length);
};
