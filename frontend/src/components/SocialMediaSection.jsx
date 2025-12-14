import './SocialMediaSection.css';

function SocialMediaSection() {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: '⚙',
      handle: '@yourrepo',
      isText: false
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: '𝕏',
      handle: '@yourrepo',
      isText: true
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: 'in',
      handle: '/company/yourrepo',
      isText: true
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: '▶',
      handle: '@yourrepo',
      isText: false
    },
    {
      name: 'Email',
      url: 'mailto:info@yourrepo.com',
      icon: '✉',
      handle: 'info@yourrepo.com',
      isText: false
    }
  ];

  return (
    <section id="social" className="social-section">
      <div className="social-container">
        <h2 className="section-title">Connect With Us</h2>
        <p className="section-subtitle">Follow us on social media and stay updated</p>
        
        <div className="social-grid">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
            >
              <div className={`social-icon ${social.isText ? 'social-icon-text' : ''}`}>{social.icon}</div>
              <h3 className="social-name">{social.name}</h3>
              <p className="social-handle">{social.handle}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialMediaSection;

