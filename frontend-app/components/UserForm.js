// components/UserForm.js
import { useState, useEffect } from "react";

const UserForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        status: user.status,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ first_name: "", last_name: "", email: "" });
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">
        {user ? "Edit User" : "Add New User"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          {user ? "Update User" : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
