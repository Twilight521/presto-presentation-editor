import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

type LandingPageProps = {
  token: string | null;
  onLogout: () => void;
};

function LandingPage({ token, onLogout }: LandingPageProps) {
  return (
    <div className={styles.landingPage}>
      <div className={styles.container}>
        <div className={styles.banner}>
          <h1>Welcome to Presto</h1>
          <div className={styles.intro}>
            <p>Simple, clean, and easy</p>
            <p>— your personal presentation editor.</p>
          </div>
        </div>

        {token ? (
          <div className={styles.bottomPart}>
            <Link to="/dashboard" className={styles.link}>
              Go to Dashboard
            </Link>
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.bottomPart}>
            <Link to="/login" className={styles.link}>
              Login
            </Link>
            <Link to="/register" className={styles.link}>
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
