import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [candidateList, setCandidateList] = useState<Candidate[]>([]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  
  useEffect(() => {
    const fetchCandidates = async () => {
      const candidates = await searchGithub();
      setCandidateList(candidates);
      if (candidates.length > 0) {
        // Fetch detailed information for the first candidate
        await loadCandidateDetails(candidates[0].login); 
      }
    };
    fetchCandidates();
  }, []);

  // New function to load detailed candidate information
  const loadCandidateDetails = async (username: string) => {
    const detailedCandidate = await searchGithubUser(username);
    setCurrentCandidate(detailedCandidate); // Update currentCandidate with detailed info
  };

  const saveCandidateAndLoadNext = async () => {
    if (currentCandidate && currentCandidate.login) {
      // Retrieve current saved candidates from local storage or initialize an empty array
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      
      // Add the detailed candidate to the saved candidates list
      savedCandidates.push(currentCandidate);
      // Save updated list back to local storage
      localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));

      loadNextCandidate();
    }
  };

  const loadNextCandidate = async () => {
    const nextIndex = candidateIndex + 1;
    if (nextIndex < candidateList.length) {
      setCandidateIndex(nextIndex);
  
      const nextCandidateLogin = candidateList[nextIndex].login;
      if (nextCandidateLogin) {
        await loadCandidateDetails(nextCandidateLogin); // Only call if login is defined
      } else {
        console.warn("Candidate login is null or undefined");
      }
    } else {
      setCurrentCandidate(null);
    }
  };
  

  return (
    <div>
      <button onClick={saveCandidateAndLoadNext}>+</button>
      <button onClick={loadNextCandidate}>-</button>
      <h1>Candidate Search</h1>
      {currentCandidate ? (
        <div>
          
          <img src={currentCandidate.avatar_url || ''} alt={`${currentCandidate.name || 'Unnamed'}'s avatar`} />
          <h2>{currentCandidate.name || 'No Name'}</h2> {/* Display name with fallback */}
          <p>Username: {currentCandidate.login}</p>
          <p>Location: {currentCandidate.location || 'Not provided'}</p> {/* Display location with fallback */}
          <p>Email: {currentCandidate.email || 'Not provided'}</p> {/* Display email with fallback */}
          <p>Company: {currentCandidate.company || 'Not provided'}</p> {/* Display company with fallback */}
          <a href={currentCandidate.html_url || ''} target="_blank" rel="noopener noreferrer">
            GitHub URL
          </a>
          
        </div>
      ) : (
        <p>No more candidates available for review</p>
      )}
    </div>
  );
};

export default CandidateSearch;
