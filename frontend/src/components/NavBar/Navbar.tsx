import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

type Props = {
  token: string | null;
  onLogout: () => void;
};

function Navbar({ token, onLogout }: Props) {
  return (
    <div className={styles.navBar}>
      <div className={styles.navLeft}>
        <Link to="/">Presto</Link>
      </div>

      <div className={styles.navRight}>
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>&nbsp;|&nbsp;
            <button type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>&nbsp;|&nbsp;
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
