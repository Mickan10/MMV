import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      if (adminDoc.exists()) {
        navigate("/admin");
      } else {
        setError("Du har inte adminbehörighet.");
        await signOut(auth);
      }
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      setError("Felaktig e-post eller lösenord. Försök igen.");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="login-email" className="sr-only">E-post</label>
        <input
          id="login-email"
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <label htmlFor="login-password" className="sr-only">Lösenord</label>
        <input
          id="login-password"
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p className="error" role="alert" aria-live="assertive">{error}</p>}
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}
