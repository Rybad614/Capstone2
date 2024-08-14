import React from "react";
import CalendarVis from "../calendar/Calendar";
import Members from "../members/Members";
import Groupchats from "./Groupchats"

function Homepage() {

  return(
    <div>
      <div className="members">
        <Members />
      </div>
      <div className="calendar">
        <CalendarVis />
      </div>
      <div className="groupchat">
        <Groupchats />
      </div>
    </div>
  )
}

export default Homepage;