import { useState, useEffect, useRef } from 'react';
import { eventMessagesAPI } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';
import { Send, Trash2, MessageCircle, Users } from 'lucide-react';

export default function EventChatBox({ eventId, currentUser, isEventOwner }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await eventMessagesAPI.getRecentMessages(eventId, 100);
      setMessages(response.reverse()); // Reverse to show oldest first
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessageCount = async () => {
    try {
      const response = await eventMessagesAPI.getMessageCount(eventId);
      setMessageCount(response.count);
    } catch (error) {
      console.error('Failed to load message count:', error);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadMessages();
      loadMessageCount();
      
      // Auto-refresh messages every 10 seconds
      const interval = setInterval(() => {
        loadMessages();
        loadMessageCount();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [eventId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser) return;

    try {
      setSending(true);
      const response = await eventMessagesAPI.sendMessage(eventId, newMessage.trim());
      setMessages([...messages, response]);
      setNewMessage('');
      setMessageCount(messageCount + 1);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await eventMessagesAPI.deleteMessage(eventId, messageId);
      setMessages(messages.filter(msg => msg.id !== messageId));
      setMessageCount(messageCount - 1);
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const canDeleteMessage = (message) => {
    if (!currentUser) return false;
    return message.userId === currentUser.id || isEventOwner;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Community Chat</h3>
              <p className="text-sm text-orange-100">{messageCount} messages</p>
            </div>
          </div>
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.userId === currentUser?.id ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.userAvatar ? (
                  <img
                    src={`http://localhost:8080${message.userAvatar}`}
                    alt={message.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                    {message.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[70%] ${
                message.userId === currentUser?.id ? 'text-right' : ''
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {message.userName}
                    {message.isOwner && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        Owner
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(message.createdAt)}
                  </span>
                </div>
                
                <div className={`relative group inline-block ${
                  message.userId === currentUser?.id 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                } rounded-2xl px-4 py-2 shadow-sm`}>
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {message.message}
                  </p>
                  
                  {/* Delete Button */}
                  {canDeleteMessage(message) && (
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {currentUser ? (
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Please{' '}
            <a href="/auth/login" className="text-orange-600 hover:text-orange-700 font-semibold">
              login
            </a>
            {' '}to join the conversation
          </p>
        </div>
      )}
    </div>
  );
}
