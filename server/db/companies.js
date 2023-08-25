import DataLoader from 'dataloader';
import { connection } from './connection.js';
import dataloader from 'dataloader';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export async function getCompanies() {
  return await getCompanyTable().select();
}

export function createCompanyLoader() {
  return new DataLoader(async (ids) => {
    console.log('[companyLoader] ids', ids);
    const companies = await getCompanyTable().select().whereIn('id', ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}
