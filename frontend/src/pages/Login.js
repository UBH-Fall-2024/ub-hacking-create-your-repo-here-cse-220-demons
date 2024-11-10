import { useState } from "react";
import { auth } from "./FirebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
//I've rewritten this garbage 8 times already why is this so hard 
//?????????
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorOne, errorTwo] = useState("");
  const {load, loading} = useState(false);
  const handleSubmit = async (e) => {
    await Login(email,password);
    e.preventDefault();
    loading(true);
    errorOne("");
    try {
        const loginInformation = await createUserWithEmailAndPassword(auth,email,password);
        console.log("You can connect");
    }
    catch {
      errorTwo("");
    }
    finally{
        loading(false);
    }
    };
    //const email = e.target.email.value;
    //const password = e.target.password.value;
    //createUserWithEmailAndPassword(database,email,password).then(data=>{
        //console.log.add(data, "authdata")
//})
}

    //try{
      //await login(email, password);
    //}
  //};

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log In</h3>

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
      />

      <button >Log in</button>

    </form>
  );
export default Login;
