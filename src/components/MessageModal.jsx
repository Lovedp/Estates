import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export default function MessageModal({ isOpen, onClose, user }) {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    try {
      const response = await fetch(`${API}/api/admin/messages/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Message {user?.username}</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}