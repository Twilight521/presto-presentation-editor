import { useState, type SubmitEvent } from "react";
import { register } from "../../utils/api";
import ErrorPopup from "../../components/ErrorPopup";
import styles from "../../styles/auth.module.css";

type Props = {
  successCallback: (_token: string) => void;
};

function RegisterPage({ successCallback }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const registerSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Email cannot be empty");
      return;
    }
    if (!name.trim()) {
      setErrorMsg("Name cannot be empty");
      return;
    }

    if (!password) {
      setErrorMsg("Password cannot be empty");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const data = await register(
        email.trim().toLowerCase(),
        password,
        name.trim(),
      );
      successCallback(data.token);
    } catch (error) {
      setErrorMsg(String(error));
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <form onSubmit={registerSubmit}>
          <h1 className={styles.title}>Register</h1>

          <div className={styles.formRow}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>Confirm password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Enter password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className={styles.btnBox}>
            <button type="submit" className={styles.submitBtn}>
              Register
            </button>
          </div>
          <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
