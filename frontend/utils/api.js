const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:3001`;

export const login = async (credentials) => {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  return data;
};

export const fetchUsers = async (statusFilter, numberFilter) => {
  const res = await fetch(`${API_URL}/users?page=1&limit=${numberFilter}&status=${statusFilter}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
  });
  const data = await res.json();
  if (data.statusCode === 401) {
    location.replace('/login')
  }
  return data;
};

export const addUser = async (user) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(user),
  });
  const newUser = await res.json();
  if (newUser.statusCode === 401) {
    location.replace('/login')
  }
  return newUser;
};

export const updateUser = async (user) => {
  const res = await fetch(`${API_URL}/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(user),
  });
  const updatedUser = await res.json();
  if (updatedUser.statusCode === 401) {
    location.replace('/login')
  }
  return updatedUser;
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
  });
  const user = await res.json();
  if (user.statusCode === 401) {
    location.replace('/login')
  }
  return user;
};
