import { useState } from "react";
import { Link } from "react-router-dom";
export default function AuthRecovery({ reset = false }) {
  const [v, setV] = useState("");
  const submit = (e) => {
    e.preventDefault();
    alert(
      reset
        ? "Reset flow is ready for a tokenized backend integration."
        : "If the email exists, recovery instructions would be sent here.",
    );
  };
  return (
    <main className="authPage">
      <div className="authCard">
        <div className="brand">
          <span className="brandMark">RR</span>
          <span>
            {/* RR <b></b> */}
          </span>
        </div>
        <h1>{reset ? "Reset password" : "Forgot password"}</h1>
        <p>
          {reset
            ? "Enter your new password."
            : "Enter your account email to start recovery."}
        </p>
        <form className="form" onSubmit={submit}>
          <label>
            {reset ? "New password" : "Email"}
            <input
              type={reset ? "password" : "email"}
              required
              value={v}
              onChange={(e) => setV(e.target.value)}
            />
          </label>
          <button className="primary wide">
            {reset ? "Reset password" : "Send recovery instructions"}
          </button>
        </form>
        <p className="centerText">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </main>
  );
}
