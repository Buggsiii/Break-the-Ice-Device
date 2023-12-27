import { Link } from 'react-router-dom';
import { Layout } from '../Components';

export default function Hello() {
  return (
    <Layout title="Break the Ice Device">
      <h2>Press Button to Play</h2>
      <ol>
        <li>
          <Link to="/mil">Who Wants to Be a Millionaire</Link>
        </li>
      </ol>
    </Layout>
  );
}
