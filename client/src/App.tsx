import { gql, useQuery } from '@apollo/client';

const HELLO_QUERY = gql`
  query {
    hello
  }
`;

function App() {
  const { data, loading, error } = useQuery(HELLO_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-700">{data.hello} Tailwind is Working!</h1>
    </div>
  );
}

export default App;
