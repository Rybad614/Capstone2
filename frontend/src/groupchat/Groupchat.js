import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../auth/UserContext";
import OtfApi from "../api/api";

function Groupchat() {
  const { currentUser } = useContext(UserContext);
  const { chat_id } = useParams();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    chat_group_id: chat_id,
    email: "YOU",
    group_name: chats.group_name,
    sender_id: currentUser.user_id,
    message_text: "",
    timestamp: new Date().toLocaleString(),
  });

  console.debug(
    "GroupChat", "\n", 
    "chats=", chats, "\n",
    "chat_id=", chat_id, "\n",
  );

  useEffect(() => {
    async function fetchMessages() {
      try {
        let messages = await OtfApi.getMessages(currentUser.user_id);
        setChats(messages);
      } catch (err) {
        console.error("FAILED getting messages", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [currentUser.user_id]);

  async function sendMessage(data) {
    try {
      let message = await OtfApi.sendMessage(data);
      return message;
    } catch (err) {
      console.error("FAILED to send message", err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newMessage = await sendMessage(formData);

    let updatedChats = [...chats];

    updatedChats.push(newMessage);
    setChats(updatedChats);

    setFormData(formData);
  }

  const chat = chats.filter(c => c.chat_group_id === Number(chat_id));

  if (loading) {
    return <p>Loading...</p>;
  }

  // If there are messages, display them
  if (chat.length > 0) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h1>{chat[0].group_name}'s Chat</h1>
        </div>
        <div className="chat-messages">
          {chat.map((message, idx) => (
            <div key={idx} className={`message ${idx % 2 === 0 ? 'blue-bg' : 'gray-bg'}`}>
              <div className="message-sender">{message.email}</div>
              <div className="message-text">{message.message_text}</div>
              <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input 
           type="text"
           className="chat-input"
           name="message_text"
           value={formData.message_text}
           onChange={handleChange}
           required
           placeholder="Message..."
          />
          <button type="submit" className="button send-button" onSubmit={handleSubmit}>Send</button>
        </form>
      </div>
    );
  } else {
    return <p>No messages in this chat.</p>;
  }
}

export default Groupchat;