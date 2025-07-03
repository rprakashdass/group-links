import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdSend } from 'react-icons/io';
import { io, Socket } from 'socket.io-client';
import API_BASE_URL from '../../config/api';
import useUser from '../../hooks/useUser';
import { BiHome } from 'react-icons/bi';
import { FaUserCircle, FaUsers } from 'react-icons/fa';
import { BsEmojiSmile } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';


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

// Helper to detect URLs in text
const urlRegex = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)|(www\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/gi;

// Helper to convert text with links to clickable JSX
function linkify(text: string, isUser: boolean) {
  return text.split(urlRegex).map((part, i) => {
    if (!part) return null;
    if (part.match(urlRegex)) {
      let url = part;
      if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isUser
              ? 'text-grey-300 underline font-bold break-all hover:text-grey-200'
              : 'text-blue-400 underline break-all hover:text-blue-600'
          }
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

// Add a simple in-memory cache for link previews
const linkPreviewCache: { [url: string]: { url: string; title: string; description: string; image?: string } } = {};

const GroupView = () => {
  const { user } = useUser();
  const [message, setMessage] = useState<string>('');
  const { groupUrl } = useParams<{ groupUrl: string }>();
  const [group, setGroup] = useState<GroupType | null>(null);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiList = ['😀', '😂', '😍', '😎', '👍', '🎉', '🙏', '🔥', '🥳', '😢'];
  const [linkPreviews, setLinkPreviews] = useState<Array<null | { url: string; title: string; description: string; image?: string }>>([]);

  useEffect(() => {
    if (!groupUrl) return;

    socketRef.current = io(API_BASE_URL);
    socketRef.current.emit('joinGroup', groupUrl);

    socketRef.current.on('newMessage', (newChat: ChatType) => {
      setChats((prevChats) => [...prevChats, newChat]);
    });

    setLoading(true);
    axios
      .get(`${API_BASE_URL}/groups/${groupUrl}`)
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

    return () => {
      socketRef.current?.disconnect();
    };
  }, [groupUrl]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  // Fetch link previews for all chat messages
  useEffect(() => {
    async function fetchAllPreviews() {
      const previews: Array<null | { url: string; title: string; description: string; image?: string }> = await Promise.all(
        chats.map(async (item) => {
          const match = item.message.match(urlRegex);
          if (!match) return null;
          const url = match[0].startsWith('http') ? match[0] : 'http://' + match[0];
          // Only allow previews for https links
          if (!/^https:\/\//.test(url)) {
            return null;
          }
          if (linkPreviewCache[url]) {
            return linkPreviewCache[url];
          }
          try {
            const res = await fetch(`${API_BASE_URL}/users/link-preview?url=${encodeURIComponent(url)}`);
            if (!res.ok) return null;
            const data = await res.json();
            linkPreviewCache[url] = data; // Cache it!
            return data;
          } catch {
            return null;
          }
        })
      );
      setLinkPreviews(previews);
    }
    if (chats.length > 0) fetchAllPreviews();
    else setLinkPreviews([]);
  }, [chats]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !groupUrl) return;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to send a message.');
        return;
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/groups/${groupUrl}/send-message`,
        {
          senderName: user?.username || 'Anonymous',
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sentMessage: ChatType = response.data;
      // Emit for others to receive
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', {
          groupUrl,
          message: sentMessage,
        });
      }
      setMessage('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleDeleteMessage = async (chat: ChatType) => {
    if (!groupUrl || !user) return;
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/groups/${groupUrl}/delete-message`, {
        data: {
          senderName: chat.senderName,
          timeStamp: chat.timeStamp,
          userId: user.id || (user as any)._id, // prefer id, fallback to _id if present
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats((prev) => prev.filter(
        (c) => !(c.senderName === chat.senderName && new Date(c.timeStamp).getTime() === new Date(chat.timeStamp).getTime())
      ));
    } catch (err) {
      alert('Failed to delete message.');
      console.error(err);
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 z-20 bg-white/90 shadow-md backdrop-blur border-b border-gray-200">
        <div className="flex items-center gap-4 p-4 md:p-6">
          <Link to="/">
            <BiHome size={32} className="text-blue-500 hover:text-blue-700 transition-colors" aria-label="Home" />
          </Link>
          <div className="flex items-center gap-3">
            <FaUsers size={40} className="text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {group?.name || 'Group Chat'}
                {group?.adminOnlyChat && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">Admin Only</span>
                )}
              </h1>
              <div className="flex gap-4 text-xs text-gray-500 mt-1">
                <span>Admin: {group?.admin?.username || 'Unknown'}</span>
                {group?.createdAt && (
                  <span>Created: {new Date(group.createdAt).toLocaleDateString()}</span>
                )}
                {group?.visits !== undefined && (
                  <span>Visits: {group.visits}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 pt-2 md:pt-4 pb-24 overflow-y-auto relative">
        <div className="relative flex flex-col gap-4 p-4 md:p-8">
          {/* Date separators */}
          {(() => {
            let lastDate = '';
            return chats.map((item, index) => {
              const msgDate = new Date(item.timeStamp).toLocaleDateString();
              const showDate = msgDate !== lastDate;
              lastDate = msgDate;
              const isUser = item.senderName === user?.username;
              const isAdmin = group?.admin?.username === item.senderName;
              // Avatar/Initial
              const avatar = (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
                  {item.senderName?.[0]?.toUpperCase() || <FaUserCircle size={28} />}
                </div>
              );
              return (
                <div key={index}>
                  {showDate && (
                    <div className="flex justify-center my-2">
                      <span className="px-3 py-1 text-xs bg-white/80 text-gray-500 rounded-full shadow">{msgDate === new Date().toLocaleDateString() ? 'Today' : msgDate}</span>
                    </div>
                  )}
                  <div className={`group flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-2 max-w-full ${isUser ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar for others */}
                      {!isUser && avatar}
                      <div
                        className={`relative max-w-[85vw] md:max-w-[60%] px-4 py-2 rounded-3xl shadow-lg transition-all duration-200 border ${
                          isUser
                            ? 'bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 text-white border-blue-400'
                            : 'bg-white text-gray-900 border-gray-200'
                        } hover:scale-[1.02] hover:shadow-xl min-w-[120px] md:min-w-[180px] lg:min-w-[220px]`}
                      >
                        {/* Sender name */}
                        <div className="flex items-center gap-1 mb-1">
                          <span className={`text-xs font-semibold ${isUser ? 'text-blue-100' : 'text-blue-700'}`}>{item.senderName}</span>
                          {isAdmin && (
                            <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-semibold border border-yellow-300">Admin</span>
                          )}
                        </div>
                        {/* Message */}
                        <p className="text-base break-words leading-relaxed">
                          {linkify(item.message, isUser)}
                        </p>
                        {/* Link preview (if any, only for first link in message) */}
                        {item.message.match(urlRegex) && linkPreviews[index] && (
                          <div style={{ border: '1px solid #ccc', padding: 8, marginTop: 4, borderRadius: 8, background: '#f8fafc' }}>
                            {linkPreviews[index].image && (
                              <img src={linkPreviews[index].image} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', float: 'left', marginRight: 12, borderRadius: 6 }} />
                            )}
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontWeight: 'bold', color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{linkPreviews[index].title}</div>
                              <div style={{ color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{linkPreviews[index].description}</div>
                              <a href={linkPreviews[index].url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: 12 }}>{linkPreviews[index].url}</a>
                            </div>
                            <div style={{ clear: 'both' }} />
                          </div>
                        )}
                        {/* Time */}
                        <div className="flex justify-end mt-1 text-xs">
                          <span className={isUser ? 'text-blue-100' : 'text-gray-400'}>
                            {item.timeStamp
                              ? new Date(item.timeStamp).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Invalid Time'}
                          </span>
                        </div>
                        {(isUser || (user && group?.admin?.username === user.username)) && (
                          <button
                            className="absolute top-2 -right-1 p-1 rounded hover:bg-red-100 text-red-500 z-10"
                            title="Delete message"
                            onClick={() => handleDeleteMessage(item)}
                          >
                            <MdDelete size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/95 border-t border-gray-200 p-3 md:p-4 flex items-center justify-center shadow-lg">
        {group?.adminOnlyChat && user?.username !== group?.admin?.username ? (
          <p className="text-center text-gray-600 font-medium w-full">Only admins can send messages</p>
        ) : (
          <form onSubmit={sendMessage} className="flex items-center gap-2 w-full max-w-2xl relative">
            <input
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-800 transition-all"
              aria-label="Type your message"
              autoComplete="off"
            />
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-yellow-500 transition-colors relative"
              aria-label="Emoji picker"
              onClick={() => setShowEmojiPicker((v) => !v)}
            >
              <BsEmojiSmile size={22} />
              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-wrap gap-1 z-50">
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="text-2xl hover:bg-gray-100 rounded p-1"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-all text-white disabled:opacity-50 shadow-md focus:ring-2 focus:ring-blue-300"
              aria-label="Send message"
            >
              <IoMdSend size={24} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GroupView;