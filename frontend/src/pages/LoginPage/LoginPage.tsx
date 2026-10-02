import { useState, type SubmitEvent } from "react";
import { login } from "../../utils/api";
import ErrorPopup from "../../components/ErrorPopup";
import styles from "../../styles/auth.module.css";

type Props = {
  successCallback: (_token: string) => void;
};

function LoginPage({ successCallback }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loginSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Email cannot be empty");
      return;
    }

    if (!password) {
      setErrorMsg("Password cannot be empty");
      return;
    }

    try {
      const data = await login(email.trim().toLowerCase(), password);
      successCallback(data.token);
    } catch (error) {
      setErrorMsg(String(error));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <form onSubmit={loginSubmit}>
          <h1 className={styles.title}>Login</h1>

          <div className={styles.formRow}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.btnBox}>
            <button type="submit" className={styles.submitBtn}>
              Login
            </button>
          </div>
        </form>
        <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
      </div>
    </div>
  );
}

export default LoginPage;
