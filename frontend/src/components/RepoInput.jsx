import { useState } from 'react';
import './RepoInput.css';

function RepoInput({ onAnalyze, loading }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onAnalyze(repoUrl.trim());
    }
  };

  const exampleRepos = [
    'facebook/react',
    'vercel/next.js',
    'microsoft/vscode'
  ];

  return (
    <div className="repo-input-container">
      <div className="input-header">
        <h2>Start Your Analysis</h2>
        <p>Get instant insights into your repository's code quality, structure, and best practices</p>
      </div>
      
      <form onSubmit={handleSubmit} className="repo-input-form">
        <div className={`input-group ${focused ? 'focused' : ''} ${repoUrl ? 'has-value' : ''}`}>
          <label htmlFor="repo-url">
            <span className="label-icon">🔗</span>
            GitHub Repository URL
          </label>
          <div className="input-wrapper">
            <span className="input-prefix">github.com/</span>
            <input
              id="repo-url"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="owner/repository"
              disabled={loading}
              required
            />
            {repoUrl && !loading && (
              <button
                type="button"
                className="input-clear"
                onClick={() => setRepoUrl('')}
                aria-label="Clear input"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="analyze-button"
          disabled={loading || !repoUrl.trim()}
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              Analyzing...
            </>
          ) : (
            <>
              <span className="button-icon">🔍</span>
              Analyze Repository
            </>
          )}
        </button>
      </form>

      <div className="input-examples">
        <p className="examples-label">Try these examples:</p>
        <div className="example-buttons">
          {exampleRepos.map((example, idx) => (
            <button
              key={idx}
              type="button"
              className="example-button"
              onClick={() => {
                setRepoUrl(`https://github.com/${example}`);
                setTimeout(() => {
                  document.getElementById('repo-url')?.focus();
                }, 100);
              }}
              disabled={loading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RepoInput;

