import { useState } from 'react';
import RepoInput from './components/RepoInput';
import ScoreDisplay from './components/ScoreDisplay';
import SummaryDisplay from './components/SummaryDisplay';
import RoadmapDisplay from './components/RoadmapDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ContactSection from './components/ContactSection';
import TeamSection from './components/TeamSection';
import InitiativesSection from './components/InitiativesSection';
import SocialMediaSection from './components/SocialMediaSection';
import './styles/App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');

  const handleAnalyze = async (url) => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setRepoUrl(url);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      
      // Small delay for smooth transition
      setTimeout(() => {
        setAnalysisResult(data);
        setLoading(false);
        // Smooth scroll to results
        setTimeout(() => {
          const resultsElement = document.querySelector('.results-container');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <img 
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
              alt="GitHub Logo" 
              className="logo-icon"
            />
            <h1>YourRepo</h1>
          </div>
          <p className="header-subtitle">Analyze and improve your GitHub repositories</p>
          <nav className="header-nav">
            <a href="#team" className="nav-link">Team</a>
            <a href="#initiatives" className="nav-link">Initiatives</a>
            <a href="#contact" className="nav-link">Contact</a>
            <a href="#social" className="nav-link">Social Media</a>
          </nav>
          <div className="header-features">
            <span className="feature-badge">📊 Score Analysis</span>
            <span className="feature-badge">📝 Detailed Reports</span>
            <span className="feature-badge">🚀 Actionable Roadmaps</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="hero-section">
          <RepoInput onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="error-message animate-slide-down">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
            <button className="error-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {analysisResult && (
          <div className="results-container animate-fade-in">
            {repoUrl && (
              <div className="repo-header">
                <div className="repo-info">
                  <span className="repo-icon">📦</span>
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="repo-link">
                    {analysisResult.repository?.fullName || repoUrl}
                  </a>
                  <span className="repo-badge">Analyzed</span>
                </div>
              </div>
            )}
            
            <ScoreDisplay scores={analysisResult.scores} />
            <SummaryDisplay summary={analysisResult.summary} />
            
            {analysisResult.skillProfile && (
              <div className="skill-profile card">
                <h3 className="card-title">
                  <span className="title-icon">👤</span>
                  Developer Skill Profile
                </h3>
                <div className="profile-content">
                  <div className="profile-item">
                    <span className="profile-label">Strengths</span>
                    <div className="profile-tags">
                      {analysisResult.skillProfile.strengths.length > 0 ? (
                        analysisResult.skillProfile.strengths.map((strength, idx) => (
                          <span key={idx} className="tag tag-success">{strength}</span>
                        ))
                      ) : (
                        <span className="tag tag-neutral">None identified</span>
                      )}
                    </div>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Areas for Growth</span>
                    <div className="profile-tags">
                      {analysisResult.skillProfile.weaknesses.length > 0 ? (
                        analysisResult.skillProfile.weaknesses.map((weakness, idx) => (
                          <span key={idx} className="tag tag-warning">{weakness}</span>
                        ))
                      ) : (
                        <span className="tag tag-neutral">None identified</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <RoadmapDisplay roadmap={analysisResult.roadmap} />

            {analysisResult.growthProjection && (
              <div className="growth-projection card">
                <h3 className="card-title">
                  <span className="title-icon">📈</span>
                  Growth Projection
                </h3>
                <div className="projection-content">
                  <div className="projection-scores">
                    <div className="projection-score">
                      <span className="projection-label">Current</span>
                      <span className="projection-value current">{analysisResult.growthProjection.currentScore}</span>
                    </div>
                    <div className="projection-arrow">→</div>
                    <div className="projection-score">
                      <span className="projection-label">Projected</span>
                      <span className="projection-value projected">{analysisResult.growthProjection.projectedScore}</span>
                    </div>
                  </div>
                  <p className="projection-message">{analysisResult.growthProjection.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <TeamSection />
        <InitiativesSection />
        <ContactSection />
        <SocialMediaSection />
      </main>

      <footer className="app-footer">
        <div className="founder-box">
          <div className="founder-content">
            <h4 className="founder-label">Founder</h4>
            <p className="founder-name">Seetharam H</p>
            <p className="founder-institution">SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</p>
          </div>
        </div>
        <p>Built with ❤️ for better code quality</p>
        <div className="footer-links">
          <a href="#team">Team</a>
          <span>•</span>
          <a href="#initiatives">Initiatives</a>
          <span>•</span>
          <a href="#contact">Contact</a>
          <span>•</span>
          <a href="#social">Social Media</a>
        </div>
      </footer>
    </div>
  );
}

export default App;

