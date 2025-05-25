import React from "react";
import "./UserCard.css";
import profilePlaceholder from "../../Assets/AvatarPlaceholder.jpg";

const UserCard = ({ user }) => {
  if (!user) return null;

  const { email, id, user_metadata } = user;
  const name = user_metadata?.full_name || "N/A";

  return (
    <div className="usercard-wrapper">
      <div className="usercard-info">
        <h3>User Information</h3>
        <p className="usercard-line">
          <strong>User ID:</strong> {id}
        </p>
        <p className="usercard-line">
          <strong>Name:</strong> {name}
        </p>
        <p className="usercard-line">
          <strong>Email:</strong> {email}
        </p>
      </div>
      <img
        src={profilePlaceholder}
        alt="User Avatar"
        className="usercard-avatar"
      />
    </div>
  );
};

export default UserCard;
