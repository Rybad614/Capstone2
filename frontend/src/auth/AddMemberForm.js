import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";
import "../auth/Form.css"
import UserContext from "./UserContext";

function AddMemberForm({ addMember }) {
  const history = useHistory();
  const { userCalendars } = useContext(UserContext);
  const [passwordData, setpasswordData] = useState("");
  const [memberList, setMemberList] = useState([{ email: "" }]);
  const [formData, setFormData] = useState([{
    email: "",
    password: "",
    calendar_id: userCalendars.calendar[0].calendar_id,
    chat_group_id: userCalendars.calendar[0].calendar_id,
  }]);
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    "AddMemberForm", "\n",
    "addMember=", typeof addMember, "\n",
    "passwordData=", passwordData, "\n",
    "memberList=", memberList, "\n",
    "formData=", formData, "\n",
    "formErrors=", formErrors, "\n",
    "userCalendars=", userCalendars.calendar, "\n",
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await Promise.all(formData.map(async (m) => await addMember(m)));
    console.log(res)
    if (res[0].success) {
      history.push("/add-member/confirm");
    } else {
      setFormErrors(res.errors);
    }
  }

  function handleMemberAdd() {
    setMemberList([...memberList, { email: "" }])
  }

  function handleMemberRemove(index) {
    const list = [...memberList];
    list.splice(index, 1);
    setMemberList(list);
  }

  function handleMemberChange(e, index) {
    const { name, value } = e.target;
    const list = [...memberList];
    list[index][name] = value;
    setMemberList(list);

    const updatedFormData = list.map(member => ({
      email: member.email,
      password: passwordData,
      calendar_id: userCalendars.calendar[0].calendar_id,
      chat_group_id: userCalendars.calendar[0].calendar_id,
    }));
    setFormData(updatedFormData);
  }

  function handlePasswordChange(e) {
    const { value } = e.target;
    setpasswordData(value);

    const updatedFormData = memberList.map(member => ({
      email: member.email,
      password: value,
      calendar_id: userCalendars.calendar[0].calendar_id,
      chat_group_id: userCalendars.calendar[0].calendar_id,
    }));
    setFormData(updatedFormData);
  }


  return (
    <>
      <h1>Add User(s):</h1>
      <main className="add-member-container">
        <div className="card">
          <article className="card-body">
            <form onSubmit={handleSubmit}>
              <section className="form-group">
                <label>CalendarID:</label>
                <input
                  type="text"
                  name="calendar-id"
                  className="form-control"
                  defaultValue={userCalendars.calendar[0].calendar_id}
                  disabled
                />
              </section>
              <section className="form-group">
                <label>ChatID:</label>
                <input
                  type="text"
                  name="chat-id"
                  className="form-control"
                  defaultValue={userCalendars.calendar[0].calendar_id}
                  disabled
                />
              </section>
              <section className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                />
              </section>
              <section className="form-group">
                <label>Members</label>
                {memberList.map((singleMember, index) => (
                  <div key={index} className="members">
                    <section className="first-division">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={singleMember.email}
                        onChange={(e) => handleMemberChange(e, index)}
                      />
                      {memberList.length - 1 === index && memberList.length < 4 &&
                        (
                          <button type="button" className="btn btn-secondary btn-sm col-12"
                            onClick={handleMemberAdd}
                          >
                            <span>Add Member</span>
                          </button>
                        )}
                    </section>
                    <section className="second-division">
                      {memberList.length > 1 &&
                        (
                          <button type="button" className="remove-btn"
                            onClick={() => handleMemberRemove(index)}
                          >
                            <span>Remove</span>
                          </button>
                        )}
                    </section>
                  </div>
                ))}
              </section>


              {formErrors.length
                ? <Alert type="danger" messages={formErrors} />
                : null
              }
              <button
                type="submit"
                className="btn btn-primary"
                onSubmit={handleSubmit}
              >
                ADD MEMBERS
              </button>
            </form>
          </article>
        </div>
      </main>
    </>
  )
}

export default AddMemberForm;