import { Link } from 'react-router-dom';
import { Layout } from '../Components';

export default function Mil() {
  return (
    <Layout title="Who Wants to Be a Millionaire" back>
      <Link to="/">Home</Link>
    </Layout>
  );
}
