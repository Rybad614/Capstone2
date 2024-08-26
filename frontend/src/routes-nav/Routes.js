import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import UserContext from "../auth/UserContext";
import "../auth/Form.css"
import Homepage from "../homepage/Homepage";
import Groupchat from "../groupchat/Groupchat";
import Profile from "../profile/Profile";
import AddMemberForm from "../auth/AddMemberForm";
import MemberConfirm from "../members/MemberConfirm";


function Routes({ login, signup, addMember, addToParticipants, chats }) {
  const { associatedUsers } = useContext(UserContext);

  console.debug(
    "Routes",
    `login=${typeof login}`,
    `signup=${typeof signup}`,
    `addMember=${typeof addMember}`,
  );

  return (
    <>
      <Switch>

        <Route exact path="/">
          <Homepage />
        </Route>

        <Route exact path="/">
          <LoginForm login={login} />
        </Route>
        
        <Route exact path="/signup">
          <SignupForm signup={signup} />
        </Route>
        
        <Route exact path="/add-member">
          <AddMemberForm addMember={addMember} />
        </Route>
        
        <Route exact path="/add-member/confirm">
          <MemberConfirm addToParticipants={addToParticipants} />
        </Route>

        <Route path="/chats/:chat_id">
          <Groupchat />
        </Route>
        
        <Route path="/users/:email">
          <Profile users={associatedUsers.participants} />
        </Route>

        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default Routes;