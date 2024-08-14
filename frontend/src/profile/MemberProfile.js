import React from "react";

function MemberProfile({ user }) {
  console.log("THIS", user)
  return(
    <div>
      <h1>{user.email}'s Page Coming Soon</h1>
    </div>
  )
}

export default MemberProfile;