import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SERVER_URL from '../../../config/api';
import { IoMdSend } from 'react-icons/io';
import useUser from '../../hooks/useUser'; // Import useUser hook

type ChatType = {
  senderName: string;
  message: string;
  timeStamp: Date;
};

type GroupType = {
  name: string;
  groupUrl: string;
  adminOnlyChat: boolean;
  chats: ChatType[];
  visits: number;
  createdAt: Date;
  admin: {
    username: string;
    email: string;
  };
};

const GroupView = () => {
  const { user } = useUser(); // Get the logged-in user's data from UserContext
  const [message, setMessage] = useState<string>('');
  const { groupUrl } = useParams<{ groupUrl: string }>();
  const [group, setGroup] = useState<GroupType | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupUrl) return;
    setLoading(true);
    axios
      .get(`${SERVER_URL}/groups/${groupUrl}`)
      .then((response) => {
        setGroup(response.data);
        setChats(response.data.chats || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load group data');
        setLoading(false);
      });
  }, [groupUrl]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !groupUrl) return;

    try {
      const token = localStorage.getItem('token'); // Retrieve the token for authentication
      if (!token) {
        alert('You must be logged in to send a message.');
        return;
      }

      const response = await axios.post(
        `${SERVER_URL}/groups/${groupUrl}/send-message`,
        {
          senderName: user?.username || 'Anonymous', // Use the logged-in user's name or fallback to 'Anonymous'
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the headers
          },
        }
      );
      setChats((prevChats) => [...prevChats, response.data]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="p-4 text-center">
          <h1 className="text-xl font-semibold text-gray-800">{group?.name || 'Group Chat'}</h1>
          <p className="text-sm text-gray-500">
            Admin: {group?.admin?.username || 'Unknown'}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 pt-16 pb-20 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          {chats.map((item, index) => (
            <div
              key={index}
              className={`flex w-full ${
                item.senderName === user?.username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                  item.senderName === user?.username
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p className="text-base">{item.message}</p>
                <div className="flex justify-between mt-1 text-xs">
                  <span
                    className={
                      item.senderName === user?.username ? 'text-blue-100' : 'text-gray-500'
                    }
                  >
                    {item.senderName}
                  </span>
                  <span
                    className={
                      item.senderName === user?.username ? 'text-blue-100' : 'text-gray-500'
                    }
                  >
                    {item.timeStamp
                      ? new Date(item.timeStamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Invalid Time'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        {group?.adminOnlyChat ? (
          <p className="text-center text-gray-600 font-medium">
            Only admins can send messages
          </p>
        ) : (
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <input
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 disabled:opacity-50"
            >
              <IoMdSend size={24} className="text-blue-500" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GroupView;