import React from "react";
import CalendarVis from "../calendar/Calendar";
import Members from "../members/Members";
import Groupchats from "./Groupchats";

import './Homepage.css';

function Homepage() {

  return(
    <main>
      <div className="members">
        <Members />
      </div>
      <div className="calendar">
        <CalendarVis />
      </div>
      <div className="groupchat">
        <Groupchats />
      </div>
    </main>
  )
}

export default Homepage;