import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import "./LandingPage.css";

function LandingPage({ login, signup }) {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <div className="LandingPage">
        <div className="wrapper">
          <main className="card">
            <article className="card-body">
              <section>
                <div
                  className="card-title text-center fs-1"
                  role="button"
                  onClick={toggleForm}
                >
                  PairedPreneurs
                </div>
                <div className={showLogin ? "visible" : "hidden"}>
                  <LoginForm login={login} />
                </div>
                <div className={!showLogin ? "visible" : "hidden"}>
                  <SignupForm signup={signup} />
                </div>
                <div className="mobile-Quote">
                  "GET Connected. STAY Connected."
                </div>
                <div className="card-footer">
                  <span className="Signup">
                    {showLogin ? (
                      <>
                        <p>
                          Don't have an account?
                          <span className="SignupLink" onClick={toggleForm}>
                            Sign up
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Already have an account?
                          <span className="SignupLink" onClick={toggleForm}>
                            Login
                          </span>
                        </p>
                      </>
                    )}
                  </span>
                </div>
              </section>
            </article>
          </main>
          <footer className="mobile-footer">
            <p>© 2024 PairedPreneurs. All rights reserved.</p>
            <p>
              <Link to="#">Privacy Policy</Link> |{" "}
              <Link to="#">Terms of Service</Link>
            </p>
          </footer>
        </div>
      </div>
      <section>
        <div className="desktop-Quote">
        "GET Connected. STAY Connected."
        </div>
      </section>
    </>
  );
}

export default LandingPage;
