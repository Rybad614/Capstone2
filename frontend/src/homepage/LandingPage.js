import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import "./LandingPage.css"

function LandingPage({ login }) {

  return (
    <div className="LandingPage">
      <div className="wrapper">
        <section className="card">
          <main className="card-body">
            <article>
              <div className="card-title text-center fs-1" role="button">
                PairedPreneurs
              </div>
              <LoginForm login={login}/>
              <div className="card-footer">
                <span className="Signup">
                  <p>Don't have an account?</p>
                  <Link to="/signup">
                    <span className="SignupLink">
                      Sign up
                    </span>
                  </Link>
                </span>
              </div>
            </article>
          </main>
          <footer>
            
          </footer>
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
