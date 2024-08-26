import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";

import  "./Navigation.css";


function Navigation({ logout }) {
  const { currentUser } = useContext(UserContext);
  console.debug("Navigation", "currentUser=", currentUser);

  const userLink = "/users/";
  function loggedInNav() {
    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className="nav-link" to={userLink + currentUser.email}>
            Profile
          </NavLink>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/" onClick={logout}>
            Log out {currentUser.email}
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <div className="Navigation">
      <nav className="navbar navbar-expand-sm">
        <Link className="navbar-brand" to="/">
          PairedPreneurs
        </Link>
        {loggedInNav()} 
      </nav>
    </div>
  );
}



export default Navigation;