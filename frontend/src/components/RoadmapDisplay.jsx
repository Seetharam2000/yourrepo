import { useState } from 'react';
import './RoadmapDisplay.css';

function RoadmapDisplay({ roadmap }) {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const toggleItem = (index) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const groupByPriority = (items) => {
    const groups = {
      'short-term': [],
      'mid-term': [],
      'long-term': []
    };

    items.forEach((item, index) => {
      if (groups[item.priority]) {
        groups[item.priority].push({ ...item, originalIndex: index });
      }
    });

    return groups;
  };

  const grouped = groupByPriority(roadmap);
  const priorityLabels = {
    'short-term': { label: 'Short-term (1-3 days)', icon: '⚡', color: '#000000' },
    'mid-term': { label: 'Mid-term (1-2 weeks)', icon: '📅', color: '#666666' },
    'long-term': { label: 'Long-term (1-2 months)', icon: '🎯', color: '#999999' }
  };

  const getImpactColor = (impact) => {
    const colors = {
      'critical': { bg: '#000000', text: '#ffffff', border: '#000000' },
      'high': { bg: '#333333', text: '#ffffff', border: '#333333' },
      'medium': { bg: '#666666', text: '#ffffff', border: '#666666' },
      'low': { bg: '#e5e5e5', text: '#000000', border: '#d0d0d0' }
    };
    return colors[impact] || colors.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Code Quality': '💻',
      'Security': '🔒',
      'Structure': '🏗️',
      'Documentation': '📚',
      'Testing': '🧪',
      'Git Practices': '📝',
      'Collaboration': '🤝',
      'DevOps': '⚙️'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="roadmap-display card">
      <h3 className="section-title">
        <span className="title-icon">🗺️</span>
        Improvement Roadmap
      </h3>
      
      {Object.entries(grouped).map(([priority, items], sectionIndex) => {
        if (items.length === 0) return null;

        const priorityInfo = priorityLabels[priority];

        return (
          <div 
            key={priority} 
            className="roadmap-section"
            style={{
              animationDelay: `${sectionIndex * 0.15}s`
            }}
          >
            <div className="roadmap-priority-header">
              <h4 className="roadmap-priority">
                <span className="priority-icon" style={{ color: priorityInfo.color }}>
                  {priorityInfo.icon}
                </span>
                {priorityInfo.label}
              </h4>
              <span className="roadmap-count">{items.length} items</span>
            </div>
            <ul className="roadmap-list">
              {items.map((item, itemIndex) => {
                const globalIndex = item.originalIndex;
                const isChecked = checkedItems.has(globalIndex);
                const impactStyle = getImpactColor(item.impact);

                return (
                  <li 
                    key={globalIndex} 
                    className={`roadmap-item ${isChecked ? 'checked' : ''}`}
                    style={{
                      animationDelay: `${(sectionIndex * 0.15) + (itemIndex * 0.1)}s`
                    }}
                  >
                    <div className="roadmap-item-content">
                      <div className="roadmap-checkbox-wrapper">
                        <input
                          type="checkbox"
                          id={`item-${globalIndex}`}
                          className="roadmap-checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(globalIndex)}
                        />
                        <label htmlFor={`item-${globalIndex}`} className="checkbox-label"></label>
                      </div>
                      <div className="roadmap-item-body">
                        <div className="roadmap-item-header">
                          <span className="roadmap-category">
                            <span className="category-icon">{getCategoryIcon(item.category)}</span>
                            {item.category}
                          </span>
                          <span
                            className="roadmap-impact"
                            style={{
                              backgroundColor: impactStyle.bg,
                              color: impactStyle.text,
                              borderColor: impactStyle.border
                            }}
                          >
                            {item.impact}
                          </span>
                        </div>
                        <p className="roadmap-task">{item.task}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {roadmap.length === 0 && (
        <div className="roadmap-empty">
          <span className="empty-icon">🎉</span>
          <p>No specific improvements identified. Great job!</p>
        </div>
      )}

      {roadmap.length > 0 && (
        <div className="roadmap-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(checkedItems.size / roadmap.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            {checkedItems.size} of {roadmap.length} items completed
          </span>
        </div>
      )}
    </div>
  );
}

export default RoadmapDisplay;

