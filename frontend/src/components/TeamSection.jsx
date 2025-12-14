import './TeamSection.css';

function TeamSection() {
  const teamMembers = [
    {
      name: 'Seetharam H',
      role: 'Founder & Lead Developer',
      institution: 'SRM Institute of Science and Technology',
      email: 'seetharam.h@srmist.edu.in'
    },
    {
      name: 'Development Team',
      role: 'Full Stack Developers',
      institution: 'SRM Institute of Science and Technology',
      email: 'dev@yourrepo.com'
    }
  ];

  return (
    <section id="team" className="team-section">
      <div className="team-container">
        <h2 className="section-title">Our Team</h2>
        <p className="section-subtitle">Meet the talented individuals behind YourRepo</p>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-avatar">
                <span className="avatar-icon">👤</span>
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-institution">{member.institution}</p>
              <a href={`mailto:${member.email}`} className="team-email">
                {member.email}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;

