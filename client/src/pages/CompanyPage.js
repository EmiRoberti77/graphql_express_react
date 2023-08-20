import { useParams } from 'react-router';
import { getCompanyById } from '../graphql/queries';
import { useEffect, useState } from 'react';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState();

  useEffect(() => {
    const fetchCompany = async () => {
      setCompany(await getCompanyById(companyId));
    };

    fetchCompany();
  }, [companyId]);

  if (!companyId) return <div>Missing companyId</div>;
  if (!company) return <div>loading ..</div>;

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
