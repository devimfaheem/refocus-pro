// components/UserCard.js
const UserCard = ({ user, onDelete, onEdit }) => {
  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="text-sm text-gray-500">Status: {user.status}</p>
      <div className="flex justify-between mt-4">
        {/* Edit button */}
        <button
          onClick={() => onEdit(user)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>

        {/* Delete button */}
        {user.status !== 'deactivated' && (
          <button
          onClick={() => onDelete(user)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
          Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
