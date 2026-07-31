import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h2 className="heading">Login to view your list</h2>
        <div className="button-group">
          <Link className="button" to="/login">Login</Link>
          <Link className="button" to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;