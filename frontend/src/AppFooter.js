import React from "react"
import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <>
      <footer className="AppFooter">
        <p>© 2024 PairedPreneurs. All rights reserved.</p>
        <p>
          <Link to="#">Privacy Policy</Link> |{" "}
          <Link to="#">Terms of Service</Link>
        </p>
      </footer>
    </>
  )
}