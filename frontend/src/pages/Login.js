import { useState } from "react";
import { auth } from '../Firebase.js'
import { createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    //await Login(email,password);
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
        const loginInformation = await createUserWithEmailAndPassword(auth,email,password);
        const user = loginInformation.user;
        setEmail("");
        setPassword("");
    }
    catch(errored){
      let errorMessage = errored.message;
      setError(errorMessage);
    }
    finally{
        setLoading(false);
    }
    };
  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log In</h3>
     {error && <div className="error">{error}</div>}
      <label>Email address:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={loading}
        />
      <button type="submit" disabled={loading}>
        {loading ? "Signing up...": "Sign up"}
      </button>
    </form>
  );
};
export default Login;
