export default function UserTable({ users = [], onDelete, onMessage }) {
    // Ensure users is always treated as an array
    const safeUsers = Array.isArray(users) ? users : [];
  
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Email</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {safeUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="table-cell">{user.username}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">
                  <button
                    onClick={() => onMessage(user)}
                    className="action-button bg-blue-600 hover:bg-blue-700"
                  >
                    Message
                  </button>
                  <button
                    onClick={() => onDelete(user._id)}
                    className="action-button bg-red-600 hover:bg-red-700 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {safeUsers.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
    );
  }