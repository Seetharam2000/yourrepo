import './InitiativesSection.css';

function InitiativesSection() {
  const initiatives = [
    {
      title: 'Open Source Contribution',
      description: 'Promoting open source development and contributing to the community through innovative tools and solutions.',
      icon: '🌐'
    },
    {
      title: 'Code Quality Education',
      description: 'Educating developers about best practices, code quality metrics, and repository management.',
      icon: '📚'
    },
    {
      title: 'Developer Tools',
      description: 'Building tools that help developers analyze, improve, and maintain their code repositories effectively.',
      icon: '🛠️'
    },
    {
      title: 'Research & Innovation',
      description: 'Conducting research in software engineering, code analysis, and automated quality assessment.',
      icon: '🔬'
    }
  ];

  return (
    <section id="initiatives" className="initiatives-section">
      <div className="initiatives-container">
        <h2 className="section-title">Our Initiatives</h2>
        <p className="section-subtitle">Driving innovation in software development and code quality</p>
        
        <div className="initiatives-grid">
          {initiatives.map((initiative, index) => (
            <div key={index} className="initiative-card">
              <div className="initiative-icon">{initiative.icon}</div>
              <h3 className="initiative-title">{initiative.title}</h3>
              <p className="initiative-description">{initiative.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InitiativesSection;

