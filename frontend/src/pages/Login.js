import { useState } from "react";
import { auth } from "../Firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const loginInformation = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = loginInformation.user;
      setEmail("");
      setPassword("");
    } catch (errored) {
      let errorMessage = errored.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: 300,
        borderRadius: 0,
        boxShadow: 0,
        width: 370,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            flex={1}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              font
              style={{ color: "grey" }}
            >
              Sign Up{" "}
            </Typography>
            {error && <div className="error">{error}</div>}
            <TextField
              label="Email address:"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              size="small"
              rows={4}
              margin="normal"
              variant="outlined"
            />

            <TextField
              label="Password:"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={loading}
              variant="outlined"
            />
            <Button
              type="button"
              variant="contained"
              sx={{
                backgroundColor: "#007FFE", // Example custom color
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#405CD6", // Darker shade on hover
                },
              }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
export default Login;
