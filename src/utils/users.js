const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate data
  if (!username || !room) {
    return {
      error: 'Username and room are required!',
    };
  }

  // Check if user already exits
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Valid username
  if (existingUser) {
    return {
      error: 'Username alraedy taken!',
    };
  }

  const user = {
    id,
    username,
    room,
  };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.filter((user) => user.id === id)[0];
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
