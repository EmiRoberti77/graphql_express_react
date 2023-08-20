import { getJobs, getJob, getJobsByCompany } from './db/jobs.js';
import { getCompany, getCompanies } from './db/companies.js';

export const resolvers = {
  Query: {
    companies: () => getCompanies(),
    company: (_root, { id }) => getCompany(id),
    job: (_root, { id }) => getJob(id),
    jobs: () => getJobs(),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job) => getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
};

const toIsoDate = (value) => {
  return value.slice(0, 'yyyy-mm-dd'.length);
};
