import React, { useEffect, useState } from 'react';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Usuarios Disponibles</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <button onClick={() => onSelectUser(user)}>{user.username}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
