import { useParams } from 'react-router';
import { companyByIdQuery, getCompanyById } from '../graphql/queries';
import JobList from '../components/JobList';
import { useQuery } from '@apollo/client';

function useCompany(companyId) {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { companyId: companyId },
  });

  return { company: data?.company, loading, error: Boolean(error) };
}

function CompanyPage() {
  const { companyId } = useParams();
  const { company, loading, error } = useCompany(companyId);

  console.log(company, loading, error);

  if (loading) return <div> . . l o a d i n g . .</div>;
  if (error) return <div>Error loading page</div>;

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2>
        <JobList jobs={company.jobs} />
      </h2>
    </div>
  );
}

export default CompanyPage;
