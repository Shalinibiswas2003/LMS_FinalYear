// Team.js
import React from 'react';
import './Team.css';

const teamMembers = [
  {
    name: 'Dhanika Dewan',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/flower.jpg',
  },
  {
    name: 'Sayantan Pramanik',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/person2.jpg',
  },
  {
    name: 'Shalini Biswas',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/person3.jpg',
  },
  {
    name: 'Aritra Ghosh',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/person4.jpg',
  },
];

function Team() {
  return (
    <div className="team-section">
      <h2 className="team-title">Meet Our Team</h2>
      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <div
              className="team-member-image"
              style={{ backgroundImage: `url(${member.imageUrl})` }}
            ></div>
            <h3 className="team-member-name">{member.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;
