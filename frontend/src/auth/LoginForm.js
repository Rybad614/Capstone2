import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";


function LoginForm({ login }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
      "LoginForm",
      "login=", typeof login,
      "formData=", formData,
      "formErrors", formErrors,
  );


  async function handleSubmit(e) {
    e.preventDefault();
    let res = await login(formData);
    if (res.success) {
      history.push("/");
    } else {
      setFormErrors(res.errors);
    }
  }


  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
    <>
      <main className="container">
        <div className="card">
          <article className="card-body">
            <form onSubmit={handleSubmit}>
              <section className="form-group">
                <label>Email</label>
                <input 
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
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
                    autoComplete="current-password"
                    required
                />
              </section>
              {
                formErrors.length
                  ? <Alert type="danger" messages={formErrors} />
                  : null
              }
              <button
                    type="submit"
                    className="btn btn-primary"
                    onSubmit={handleSubmit}
                >
                  Log In
              </button>
            </form>
          </article>
        </div>
      </main>
    </>
  );
}


export default LoginForm;