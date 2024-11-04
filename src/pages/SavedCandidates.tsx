import { useEffect, useState } from 'react';
import { searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [detailedCandidates, setDetailedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchSavedCandidates = () => {
      const candidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      setSavedCandidates(candidates);
    };

    fetchSavedCandidates();
  }, []);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      const candidateDetails = await Promise.all(
        savedCandidates.map(candidate => searchGithubUser(candidate.login || ''))
      );
      setDetailedCandidates(candidateDetails);
    };
    if (savedCandidates.length > 0) {
      fetchCandidateDetails();
    }
  }, [savedCandidates]);

  return (
    <div>
      <h1>Saved Candidates</h1>
      {detailedCandidates.length > 0 ? (
        detailedCandidates.map((candidate, index) => (
          <div key={index}>
            <img src={candidate.avatar_url || ''} alt={`${candidate.name}'s avatar`} />
            <h2>{candidate.name}</h2>
            <p>Username: {candidate.login}</p>
            <p>Location: {candidate.location || 'Not Provided'}</p>
            <p>Email: {candidate.email || 'Not Provided'}</p>
            <p>Company: {candidate.company || 'Not Provided'}</p>
            <a href={candidate.html_url || ''} target="_blank" rel="noopener noreferrer">
              GitHub URL
            </a>
          </div>
        ))
      ) : (
        <p>No candidates saved.</p>
      )}
    </div>
  );
};

export default SavedCandidates;
