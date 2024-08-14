import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";
import "../auth/Form.css"


function SignupForm({ signup }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [memberList, setMemberList] = useState([{ member: "" }]);
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
      "SignupForm",
      "signup=", typeof signup,
      "formData=", formData,
      "formErrors=", formErrors,
  );


  async function handleSubmit(e) {
    e.preventDefault();
    let res = await signup(formData);
    if (res.success) {
      history.push("/");
    } else {
      setFormErrors(res.errors);
    }
  }

  function handleMemberAdd() {
    setMemberList([...memberList, { member: "" }])
  }

  function handleMemberRemove(index) {
    const list = [...memberList];
    list.splice(index, 1);
    setMemberList(list);
  }

  function handleMemberChange(e, index) {
    const {name, value} = e.target;
    const list = [...memberList];
    list[index][name] = value;
    setMemberList(list);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return(
    <>
      <main className="Signup-container">
        <div className="card">
          <article className="card-body">
            <h2 className="card-title">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <section className="form-group">
                <label>Username</label>
                <input 
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                />
              </section>
              <section className="form-group">
                <label>Email</label>
                <input 
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                />
              </section>
              <section className="form-group">
                <label>Password</label>
                <input 
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                />
              </section>
              {/* <section className="form-group">
                <label>Members</label>
                {memberList.map((singleMember, index) => (
                  <div key={index} className="members">
                    <section className="first-division">
                      <input 
                        type="email"
                        name="member"
                        className="form-control"
                        value={singleMember.member}
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
              </section> */}
              {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }
              <button
                    type="submit"
                    className="btn btn-primary"
                    onSubmit={handleSubmit}
                >
                  Sign Up
                </button>
            </form>
          </article>
        </div>
      </main>
    </>
  );
}

export default SignupForm;