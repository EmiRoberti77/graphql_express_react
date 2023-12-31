import { GraphQLError } from 'graphql';
import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  deleteJob,
  updateJob,
  getJobsCount,
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
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await getJobsCount();
      return {
        items,
        totalCount,
      };
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, context) => {
      console.log('context', context);
      const { user } = context;
      if (!user)
        throw notFound('no authorization token for createJob', 'NO_AUTH');

      const companyId = user.companyId;
      const jobCreated = createJob({ companyId, title, description });
      return jobCreated;
    },
    deleteJob: async (_root, { id }, context) => {
      const { user } = context;
      if (!user)
        throw notFound('no authorization token for createJob', 'NO_AUTH');

      const job = await deleteJob(id, user.companyId);
      if (!job) throw notFound('job not found for id:' + id, 'NOT_FOUND');

      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description }, context }
    ) => {
      const { user } = context;
      if (!user)
        throw notFound('no authorization token for createJob', 'NO_AUTH');
      const companyId = user.companyId;
      const job = await updateJob({ id, title, description, companyId });

      if (!job) throw notFound('job not found for id:' + id, 'NOT_FOUND');
      return job;
    },
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job, _args, { companyLoader }) => {
      return companyLoader.load(job.companyId);
    },
    date: (job) => toIsoDate(job.createdAt),
  },
};

const notFound = (msg, code) => {
  return new GraphQLError(msg, { extensions: { code } });
};

const toIsoDate = (value) => {
  return value.slice(0, 'yyyy-mm-dd'.length);
};
