import { useState } from "react";
import { auth } from '../Firebase.js'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TextField } from "@mui/material";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 3,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'black',
    height: 40,
    padding: '100 300px',
  },
});

const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
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
    <Box display flexDirection = "column" alignItems = "center" gap={(2)}
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 300,
            borderRadius: 0,
            boxShadow: 0,
            width: 370,
          }}>
    <form className={classes.root} onSubmit={handleSubmit}>
      <Paper elevation = {20}>
        <div className = "form_container" style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          height: "25vh",
        }
        }>
        <Typography variant="h4" className={classes.title}>
      Please Login
      </Typography>
     {error && <div className="error">{error}</div>}
     <TextField
      className = "input"
      id = "standard-password-input"
      label = "Email address:"
      type="email"
      onChange={(e) => setEmail(e.target.value)}
      value={email}
      variant = "outlined"
      />
      <TextField
      label = "Password:"
      type="password"
      onChange={(e) => setPassword(e.target.value)}
      value={password}
      disabled={loading}
      variant = "outlined"
        />
      <Button type="button" variant = "contained"
      sx = {{
      backgroundColor: '#0000ff', // Example custom color
      color: '#ffffff',
     '&:hover': {
      backgroundColor: '#000080', // Darker shade on hover
      },
    }}
      disabled={loading}>
        {loading ? "Signing In...": "Sign In"}
      </Button>
      </div>
      </Paper>
    </form>
    </Box>
  );
};
export default Login;
