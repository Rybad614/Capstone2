import React, { useState, useEffect } from "react";
import { Route, useLocation } from "react-router-dom";
import jwt from "jsonwebtoken";

import OtfApi from "./api/api";

import UserContext from "./auth/UserContext";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import Routes from "./routes-nav/Routes";
import SignupForm from "./auth/SignupForm";
import NonUser from "./routes-nav/NonUser";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "otf-token";



function App() {
  const location = useLocation();
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [associatedUsers, setAssociatedUsers] = useState([]);
  const [memberConfirmation, setMemberConfirmation] = useState([]);
  const [userCalendars, setUserCalendars] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug(
    "App", "\n",
    "memberConfirmation=", memberConfirmation, "\n",
    "infoLoaded=", infoLoaded, "\n",
    "currentUser=", currentUser, "\n",
    "associatedUsers=", associatedUsers, "\n",
    "token=", token, "\n",
  );

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);
    
    if (location.state && location.state.refresh) {
      window.location.reload();
    }

    async function getCurrentUser() {
      if (token) {
        try {
          let { email } = jwt.decode(token);
          // put the token on the Api class so it can use it to call the API.
          OtfApi.token = token;
          let currentUser = await OtfApi.getCurrentUser(email);
          setCurrentUser(currentUser);
          getAssociatedUsers(currentUser.email);
          getCalendars(currentUser.user_id);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    };

    async function getAssociatedUsers(email) {
      try {
        let associatedUsers = await OtfApi.getAssociatedUsers(email);
        setAssociatedUsers(associatedUsers);
      } catch (err) {
        console.error("App loadUserInfo: problem loading", err);
        setAssociatedUsers([]);
      }
      setInfoLoaded(true);
    };

    async function getCalendars(user_id) {
      try{
        let userCalendars = await OtfApi.getUserCalendars(user_id);
        setUserCalendars(userCalendars);
        getEvents(userCalendars.calendar[0].user_id, userCalendars.calendar[0].calendar_id);
      } catch (err) {
        console.error("App loadUserInfo: problem loading", err);
        setUserCalendars([])
      }
      setInfoLoaded(true);
    };

    async function getEvents(user_id, calendar_id) {
      try{
        let userEvents = await OtfApi.getUserEvents(user_id, calendar_id);
        setUserEvents(userEvents.event);
      } catch (err) {
        console.error("App loadUserInfo: problem loading", err);
        setUserEvents([])
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCurrentUser();
  }, [location, token]);


  /** Handles site-wide logout. */
  function logout() {
    setUserCalendars([]);
    setAssociatedUsers([]);
    setCurrentUser(null);
    setToken(null);
  }

  /** Handles site-wide signup.
  *
  * Automatically logs them in (set token) upon signup.
  *
  * Make sure you await this function and check its return value!
  */
  async function signup(signupData) {
    try {
      let token = await OtfApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles site-wide login.
  *
  * Make sure you await this function and check its return value!
  */
  async function login(loginData) {
    try {
      let token = await OtfApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  async function addMember(memberData) {
    try {
      let addMembers = await OtfApi.addMember(memberData);
      memberConfirmation.push(...addMembers);
      return { success: true };
    } catch (err) {
      console.error("FAILED Adding Member(s)", err);
      setMemberConfirmation([]);
      return { success: false, err };
    }
  }
  
  async function addToParticipants(memberData) {
    try {
      let addMember = await OtfApi.addToParticipants(memberData);
      console.log(addMember)
      return { success: true };
    } catch (err) {
      console.error("FAILED Adding To Participants");
      return { success: false, err };
    }
  }

  function renderNonUserView() {
    return(<div className="App">
     <NonUser login={login} />
     <Route exact path="/signup">
      <SignupForm signup={signup} />
     </Route>
    </div>
    );
  }
  function renderUserView() {
    return(
      <UserContext.Provider
        value={{
          currentUser,
          setCurrentUser,
          associatedUsers,
          setAssociatedUsers,
          memberConfirmation,
          setMemberConfirmation,
          userCalendars,
          setUserCalendars,
          userEvents,
          setUserEvents,
        }}>
        <div className="App">
          <Navigation logout={logout} />
          <Routes
          login={login}
          signup={signup}
          addMember={addMember}
          addToParticipants={addToParticipants}
          />
        </div>
      </UserContext.Provider>
    );
  }

  if (!infoLoaded) return "Loading...";

  return(
    <div>
      {(!currentUser) ? renderNonUserView() : renderUserView()}
    </div>
    );
}

export default App;
