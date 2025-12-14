import { useEffect, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';
import './ScoreDisplay.css';

function ScoreDisplay({ scores }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981'; // green for high scores
    if (score >= 50) return '#f59e0b'; // amber for medium scores
    return '#ef4444'; // red for low scores
  };

  const getLevelBadge = (level) => {
    const badges = {
      'Advanced': { color: '#10b981', emoji: '🥇', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
      'Intermediate': { color: '#f59e0b', emoji: '🥈', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
      'Beginner': { color: '#ef4444', emoji: '🥉', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
    };
    return badges[level] || badges['Beginner'];
  };

  const badge = getLevelBadge(scores.level);
  const categoryNames = {
    codeQuality: { name: 'Code Quality', icon: '💻' },
    structure: { name: 'Structure & Architecture', icon: '🏗️' },
    documentation: { name: 'Documentation', icon: '📚' },
    testing: { name: 'Testing & Maintainability', icon: '🧪' },
    gitCollaboration: { name: 'Git & Collaboration', icon: '🤝' },
    devops: { name: 'DevOps & Automation', icon: '⚙️' }
  };

  return (
    <div className="score-display card">
      <div className="overall-score">
        <div className="score-circle-wrapper">
          <svg className="score-circle-svg" viewBox="0 0 200 200">
            <circle
              className="score-circle-bg"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              className="score-circle-progress"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={getScoreColor(scores.overall)}
              strokeWidth="12"
              strokeDasharray={`${(scores.overall / 100) * 565} 565`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              style={{
                transition: 'stroke-dasharray 2s ease-out',
                opacity: animated ? 1 : 0
              }}
            />
          </svg>
          <div className="score-circle-content">
            <div className="score-value" style={{ color: getScoreColor(scores.overall) }}>
              <AnimatedCounter value={scores.overall} duration={2000} />
            </div>
            <div className="score-max">/ 100</div>
          </div>
        </div>
        <div className="score-info">
          <h2 className="score-title">Overall Score</h2>
          <div className="level-badge" style={{ background: badge.gradient }}>
            <span className="badge-emoji">{badge.emoji}</span>
            <span className="badge-text">{scores.level}</span>
          </div>
          <p className="score-description">
            {scores.overall >= 75 
              ? 'Excellent! Your repository demonstrates professional-grade practices.'
              : scores.overall >= 50
              ? 'Good foundation! Focus on the roadmap to reach the next level.'
              : 'Great start! Follow the roadmap to improve your repository quality.'}
          </p>
        </div>
      </div>

      <div className="category-scores">
        <h3 className="section-title">
          <span className="title-icon">📊</span>
          Category Breakdown
        </h3>
        <div className="category-grid">
          {Object.entries(scores.categories).map(([key, score], index) => {
            const maxScore = scores.maxScores[key];
            const percentage = (score / maxScore) * 100;
            const category = categoryNames[key] || { name: key, icon: '📋' };
            
            return (
              <div 
                key={key} 
                className="category-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: animated ? 1 : 0,
                  transform: animated ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className="category-header">
                  <div className="category-title">
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                  </div>
                  <span className="category-score">
                    <AnimatedCounter value={score} duration={1500} /> / {maxScore}
                  </span>
                </div>
                <div className="category-bar-wrapper">
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: animated ? `${percentage}%` : '0%',
                        backgroundColor: getScoreColor(score),
                        transition: `width 1.5s ease-out ${index * 0.1}s`
                      }}
                    />
                  </div>
                  <span className="category-percentage">{Math.round(percentage)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ScoreDisplay;

