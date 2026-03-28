import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiMessageSquare, FiUsers } from 'react-icons/fi';
import api from '../api';
import { initSocket } from '../socket';

const ChatDashboard = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [socket, setSocket] = useState(null);

  // Fetch all rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get('/rooms/my-groups');
        setRooms(data);
      } catch (err) {
        console.error("Failed to load rooms", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
    
    if (user?.id) {
      setSocket(initSocket(user.id));
    }
  }, [user?.id]);

  // Handle active room change & fetch messages
  useEffect(() => {
    if (!activeRoom || !socket) return;
    
    setMessages([]); // Reset until loaded
    
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${activeRoom.room_id}`);
        setMessages(data);
        
        socket.emit('join_room', activeRoom.room_id);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    
    fetchMessages();

    const handleReceiveMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [activeRoom, socket]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    try {
      await api.post(`/chat/${activeRoom.room_id}`, { message: newMessage });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Chat...</div>;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)] p-4 flex gap-4">
      
      {/* LEFT SIDEBAR: Room List */}
      <div className="w-1/3 md:w-1/4 glass-panel flex flex-col overflow-hidden h-full">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FiMessageSquare className="text-primary" /> My Chats
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full">
          {rooms.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm h-full flex flex-col justify-center items-center">
              <span className="text-4xl mb-3">📭</span>
              <p>No rooms joined yet.</p>
              <button onClick={() => navigate('/find-rooms')} className="mt-4 text-primary hover:underline font-bold">Find Rooms</button>
            </div>
          ) : (
            rooms.map(room => (
              <div 
                key={room.room_id} 
                onClick={() => setActiveRoom(room)}
                className={`p-4 border-b border-slate-50 dark:border-slate-800/50 cursor-pointer transition-all ${
                  activeRoom?.room_id === room.room_id 
                    ? 'bg-indigo-50/80 dark:bg-indigo-900/40 border-l-4 border-l-primary' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate">{room.block}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{room.room_type}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <FiUsers /> Admin: {room.owner_id === user.id ? 'You' : room.owner_name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT MAIN PANEL: Active Chat */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden h-full">
        {!activeRoom ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30 dark:bg-slate-900/20">
            <FiMessageSquare className="w-16 h-16 opacity-20 mb-4" />
            <p className="text-lg">Select a room to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-800 dark:text-white text-lg">Room {activeRoom.block}</h2>
                <p className="text-xs text-primary dark:text-indigo-400 font-medium">{activeRoom.room_type} • Encrypted</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/10">
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-10 text-sm">
                  Start the conversation! 👋
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.sender_id === user.id;
                  return (
                    <div key={idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <span className="text-xs text-slate-400 mb-1 mx-1">{isMine ? 'You' : msg.sender_name}</span>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-2.5 ${
                        isMine 
                        ? 'bg-gradient-to-br from-primary to-indigo-600 text-white rounded-br-none shadow shadow-indigo-500/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700/50'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 mx-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleSend} className="flex relative items-center gap-3">
                <input 
                  type="text" 
                  className="flex-1 input-field py-3 bg-white dark:bg-slate-900 shadow-inner" 
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-primary to-indigo-500 text-white rounded-xl shadow-md hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all absolute right-2 hover:-translate-y-0.5 active:scale-95"
                >
                  <FiSend />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default ChatDashboard;
