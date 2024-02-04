import { Link } from 'react-router-dom';
import Layout from '../Shared/Layout';

export default function Err404() {
  return (
    <Layout title="404" back>
      <h2>Page Not Found</h2>
      <Link to="/">Home</Link>
    </Layout>
  );
}
