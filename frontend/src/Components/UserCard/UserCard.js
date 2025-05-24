import React from 'react';

const UserCard = ({ user }) => {
  const { email, id, user_metadata } = user;

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-50">
      <p><strong>Email:</strong> {email}</p>
      <p><strong>User ID:</strong> {id}</p>
      {user_metadata?.full_name && (
        <p><strong>Name:</strong> {user_metadata.full_name}</p>
      )}
    </div>
  );
};

export default UserCard;
