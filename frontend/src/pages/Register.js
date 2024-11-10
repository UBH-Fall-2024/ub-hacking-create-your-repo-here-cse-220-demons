import { useState } from "react";
import { auth } from "../Firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import {
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { TextField } from "@mui/material";
import { firestore } from "../Firebase";
import {
  collection,
  setDoc,
  addDoc,
  getDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { redirect, useNavigate, Navigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const user = "";
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const loginInformation = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      user = loginInformation.user;
      const document = doc(firestore, "users", user.uid);
      const userDocSnapshot = await getDoc(document);
      if (!userDocSnapshot.exists() || !userDocSnapshot.data().role) {
        return;
      }
      if (!role) {
        setError("Please fill in all fields");
        return;
      }

      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        role: role,
      });
    } catch (errored) {
      let errorMessage = errored.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
      if (role == "Student" && user) {
        navigate("/student");
      }

      if (role == "Teaching Assistant" && user) {
        navigate("/ta");
      }
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
              variant="h4"
              fontWeight="bold"
              font
              style={{ color: "#007FFE" }}
            >
              Welcome to Wait-Less!{" "}
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              font
              style={{ color: "grey" }}
            >
              Sign In{" "}
            </Typography>
            <FormControl
              sx={{ width: "55%", height: "25%", m: 0 }}
              margin="normal"
            >
              <InputLabel id="categorization-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Categorization"
              >
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Teaching Assistant">
                  Teaching Assistant
                </MenuItem>
              </Select>
            </FormControl>
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
              size="small"
              rows={4}
              margin="normal"
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
              onClick={handleSubmit}
            >
              {loading ? "Logging In..." : "Log In"}
            </Button>
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
              onClick={handleSignUp}
            >
              {loading ? "Registering..." : "Don't have an account? Register"}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
export default Register;
