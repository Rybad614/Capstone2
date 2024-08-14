import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";


function Groupchats() {
  const { currentUser, associatedUsers } = useContext(UserContext);

  if (!associatedUsers.participants || !Array.isArray(associatedUsers.participants)) {
    return( <div className="chat-group">
            <h3>GroupChats:</h3>
            <p>No chats available</p>
           </div>);
  }

  const link = "/chats/";
  const chats = associatedUsers.participants.filter((chat) => chat.email === currentUser.email);
  return (
    <div className="chat-group">
      <h3>GroupChats:</h3>
      {chats.map((chat, idx) => (
        <div key={idx}>
          <Link to={link + chat.chat_group_id}>{chat.group_name}</Link>
        </div>
      ))}
    </div>
  );
}

export default Groupchats;