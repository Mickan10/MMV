import "./Contact.css";
import person from "../assets/erik.jpg";

const teamMembers = [
  {
    name: "Anna Svensson",
    role: "Projektledare",
    img: person,
    email: "anna@example.com",
  },
  {
    name: "Erik Johansson",
    role: "Utvecklare",
    img: person,
    email: "erik@example.com",
  },
  {
    name: "Maria Andersson",
    role: "Marknadsföring",
    img: person,
    email: "maria@example.com",
  },
];

const Contact = () => {
  return (
    <section className="contact-section">
      <h2>Kontakta Oss</h2>
      <p className="intro-text">Hör gärna av dig om du har några frågor!</p>

      <div className="contact-info">
        <p><strong>Telefon:</strong> 0123-456 789</p>
        <p><strong>E-post:</strong> info@mmvevent.se</p>
        <p><strong>Adress:</strong> Storgatan 1, 123 45 Stad</p>
      </div>

      <h3>Vårt Team</h3>
      <div className="team-container">
        {teamMembers.map((member) => (
          <div key={member.email} className="team-member">
            <img src={member.img} alt={member.name} className="team-photo" />
            <div className="member-details">
              <h4>{member.name}</h4>
              <p className="role">{member.role}</p>
              <a href={`mailto:${member.email}`} className="email-link">{member.email}</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contact;
