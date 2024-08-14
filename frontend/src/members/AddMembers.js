import React from "react";
import { NavLink } from "react-router-dom";


function AddMembers() {
  return(
    <i className="add-member">
      <NavLink className="nav-link" to="/add-member">
        ++
      </NavLink>
    </i>
  )
}

export default AddMembers;