import React, { useContext, useState } from "react";
import UserContext from "../auth/UserContext";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";


function MemberConfirm({ addToParticipants }) {
  const history = useHistory()
  const { memberConfirmation, setMemberConfirmation, userCalendars } = useContext(UserContext);
  const [memberConfirmed, setMemberConfirmed] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    "MemberConfirm", "\n",
    "memberConfirmation=", memberConfirmation, "\n",
    "memberConfirmed=", memberConfirmed, "\n",
    "formErrors=", formErrors, "\n",
  );

  function handleMemberComfirmation(members) {
    let member = members.find(m => members);
    member["calendar_id"] = userCalendars.calendar[0].calendar_id;
    member["chat_group_id"] = userCalendars.calendar[0].calendar_id;
    console.log(member)
    return member;
  }

  async function handleSubmit(e, idx) {
    e.preventDefault();
    const handleMember = handleMemberComfirmation(memberConfirmation);
    const res = await addToParticipants(handleMember);
    if (res.success) {
      setMemberConfirmed(true);
      const updatedMembers = memberConfirmation.filter((_, index) => index !== idx);
      setMemberConfirmation(updatedMembers);
    } else {
      setFormErrors(res.errors);
    }
  }

  function navBackHome() {
    setMemberConfirmed(false);
    setMemberConfirmation([]);
    history.push("/", { refresh: true });
  }

  return(
  <>
    <h1>CONFIRMATION:</h1>
    {memberConfirmation.map((member, idx) => (
      <div className="member" key={idx}>
        <h2>{member.email}</h2>
        <p>INFO:</p>
        <button onClick={(e) => handleSubmit(e, idx)}>This Is Correct!</button>
        <br/>
      </div>
    ))}
    {memberConfirmed && (
    <Link className="btn btn-primary" to="/" onClick={navBackHome}>Confirm</Link>
    )}
  </>
  );
}

export default MemberConfirm;