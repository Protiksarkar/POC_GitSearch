import { Box } from '@mui/material';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

const DetailsPage = () => {

  const [repoDetails, setRepoDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const routeParams = useParams()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.github.com/repositories/${routeParams.id}`
        );
        const data = await response.json();
        setRepoDetails({
          name: data.name,
          owner: data.owner.login,
          description: data.description,
          stars: data.stargazers_count,
          forks: data.forks_count,
          url: data.html_url,
          avatar: data.owner.avatar_url,
        });
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [routeParams.id]);

  useEffect(() => {
  }, [routeParams])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
              <img src={repoDetails.avatar} alt="avatar" width="150" height="150" style={{ borderRadius: "50%", marginRight: "50px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)" }} />
              <div>
                <h1 style={{ marginBottom: "5px" }}>{repoDetails.name}</h1>
                <p style={{ marginBottom: "5px" }}>Owner: {repoDetails.owner}</p>
                <p style={{ marginBottom: "5px" }}>Stars: {repoDetails.stars}</p>
                <p style={{ marginBottom: "5px" }}>Forks: {repoDetails.forks}</p>
                <a href={repoDetails.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "20px", textDecoration: "none", color: "#0366d6" }}>Go to repository</a>
              </div>
            </div>
            <p style={{ maxWidth: "800px", textAlign: "center", lineHeight: "1.5", fontSize: "18px" }}>{repoDetails.description}</p>
          </>
        )}
      </div>
    </Box>
  );
};

export default DetailsPage
