import React, { useState, useEffect } from 'react';

export default function Fetch() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('./data.json')
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    {data.map((item) => (
  <div key={item.id}>
    <h2>{item.title}</h2>
  </div>
))}
    </div>
  );
}