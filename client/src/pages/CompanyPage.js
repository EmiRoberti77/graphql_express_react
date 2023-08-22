import { useParams } from 'react-router';
import { getCompanyById } from '../graphql/queries';
import { useEffect, useState } from 'react';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState();
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        console.log('searching for company', companyId);
        const response = await getCompanyById(companyId);
        setState({
          company: company,
          loading: false,
          error: false,
        });
        console.log(state);
        setCompany(response);
      } catch (err) {
        setState({
          company: null,
          loading: false,
          error: true,
        });
        console.log(state);
      }
    };

    fetchCompany();
  }, [companyId]);

  if (!companyId) return <div>Missing companyId</div>;
  if (!company) return <div>. . l o a d i n g ..</div>;

  const { loading, error } = state;

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
