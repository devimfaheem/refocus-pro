// Dashboard.js
import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import UserForm from "../components/UserForm";
import Modal from "../components/Modal";
import { fetchUsers, deleteUser, addUser, updateUser } from "../utils/api";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("active");
  const [numberFilter, setNumberFilter] = useState("20");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchUsers(statusFilter, numberFilter).then((res) => setUsers(res.data));
  }, [statusFilter, numberFilter]);

  const handleDelete = async () => {
    await deleteUser(userToDelete.id);
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setIsModalOpen(false);
  };

  const handleAddOrEditUser = async (user) => {
    setErrorMessage("");
    if (userToEdit) {
      const updatedUser = await updateUser(user);
      if (updatedUser.statusCode > 400 && updatedUser?.message) {
        setErrorMessage(updatedUser?.message);
      }
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    } else {
      const newUser = await addUser(user);
      if (newUser.statusCode > 400 && newUser?.message) {
        setErrorMessage(newUser?.message);
      }
      setUsers([...users, newUser]);
    }
    setUserToEdit(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management Dashboard</h1>
      <div className="flex">
        <div className="mb-4 mr-5">
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
        <div className="mb-4">
          <select
            onChange={(e) => setNumberFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="20">20</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={() => {
              setUserToDelete(user);
              setIsModalOpen(true);
            }}
            onEdit={() => {
              setUserToEdit(user);
            }}
          />
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-bold">Are you sure?</h2>
            <p>Do you want to delete this user?</p>
            <div className="mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}

      <UserForm user={userToEdit} onSubmit={handleAddOrEditUser} errorMessage={errorMessage} />
    </div>
  );
};

export default Dashboard;
