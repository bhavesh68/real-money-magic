// src/screens/Hello.tsx
// This file is no longer in use and was for testing purposes.

import { gql, useQuery } from '@apollo/client';

const HELLO_QUERY = gql`
  query {
    hello
  }
`;

const Hello = () => {
  const { data, loading, error } = useQuery(HELLO_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <h1 className="text-3xl font-bold text-blue-800">
        {data.hello} Tailwind is Working!
      </h1>
    </div>
  );
};

export default Hello;
