import React, { useContext } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import MemberProfile from "./MemberProfile";
import UserContext from "../auth/UserContext";

import './Profile.css'

function Profile({ users }) {
  const { currentUser } = useContext(UserContext);
  const { email } = useParams();
  console.log(users)
  console.log(email)

  if (email !== currentUser.email) {
    const currUser = users.find(
      user => user.email === email
    );
    return <MemberProfile user={currUser} />;
  }
  return(
    <div className="profile-title">
      <h1>(YOUR) Profile Page Coming Soon</h1>
    </div>
  )
}

export default Profile;