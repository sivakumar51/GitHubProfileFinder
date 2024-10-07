import React, { useState } from 'react';
import axios from 'axios';
import './GitHubFinder.css'; 
const GitHubProfileFinder = () => {
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState(null);
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        setError(''); 
        setLoading(true); 
        try {
            const profileResponse = await axios.get(`https://api.github.com/users/${username}`);
            setProfile(profileResponse.data);
            
            const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`);
            setRepos(reposResponse.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('User not found');
            } else {
                setError('Error fetching user data');
            }
            setProfile(null);
            setRepos([]);
        } finally {
            setLoading(false); 
        }
    };

    const handleInputChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProfile();
    };

    return (
        <div className='finder-container'>
            <h1>GitHub Profile Finder</h1>
            <div className='finder-searcher'>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Enter GitHub username"
                        value={username}
                        className='input'
                        onChange={handleInputChange}
                        required
                    /> <br/><br/>
                    <button type="submit" className='submit-button'>Search</button>
                </form>
            </div>

            {loading && <p>Loading...</p>}
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className='names-repo'>
            {profile && (
                <div className='finder-name'>
                    <h2>{profile.name || 'No Name Provided'}</h2>
                    <br />
                    <img src={profile.avatar_url} alt={profile.name} width="100" />
                    <br />
                    <a href={profile.html_url} target="_blank" rel="noopener noreferrer">View Profile</a>
                    <p>Followers: {profile.followers}</p>
                    <p>Public Repos: {profile.public_repos}</p>
                </div>
            )}

            {repos.length > 0 && (
                <div className='finder-repo'>
                    <h3>Repositories:</h3>
                    <ul>
                        {repos.map(repo => (
                            <li key={repo.id}>
                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a> 
                                - {repo.description || 'No description available'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            </div>

            {profile && repos.length === 0 && !loading && <p>No public repositories found.</p>}
        </div>
    );
};

export default GitHubProfileFinder;
