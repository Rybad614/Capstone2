import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import AddMembers from "./AddMembers";

import './Members.css';

function Members() {
  const { currentUser, associatedUsers } = useContext(UserContext);
  console.debug("Members", "associatedUsers=", associatedUsers);

  function displayMembers() {
    if (!associatedUsers || !Array.isArray(associatedUsers.participants)) {
      return <p>No members found</p>;
    }

    let members = associatedUsers.participants
    .filter((user) => user.email !== currentUser.email)
    .reduce((unique, user) => {
      if (!unique.some(u => u.email === user.email)) {
        unique.push(user);
      }
      return unique;
    }, []);
    
    let link = "/users/";
    return (
      members.map((u, idx) => (
        <li className="nav-item" key={idx}>
          <NavLink className="nav-link" to={link + u.email}>
            {u.email}
          </NavLink>
        </li>
      ))
    );
  };

  return(
    <>
      <nav className="navbar navbar-expand-sm">
        Team Members:
        <ul className="navbar-nav">
          <AddMembers />
        {
          displayMembers()
        }
        </ul>
      </nav>
    </>
  );
}

export default Members;