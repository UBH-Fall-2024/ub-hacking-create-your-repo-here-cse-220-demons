"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  Snackbar,
  Modal,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import { firestore } from "../Firebase";
import {
  collection,
  setDoc,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import StudentAppBar from "./StudentAppBar";
import { CircularProgress } from "@mui/material";

export default function QueueManager() {
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState("");
  const [post, setPost] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [name, setName] = useState("");
  const [ubit, setUbit] = useState("");
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");

  // Fetch queue data on component mount
  useEffect(() => {
    const unsubscribeQueue = updateQueue();
    const unsubscribeQuestions = updateQuestions();

    return () => {
      if (unsubscribeQueue) unsubscribeQueue();
      if (unsubscribeQuestions) unsubscribeQuestions();
    };
  }, []);
  const collectionRef = collection(firestore, "students");

  onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Real-time data:", data);
  });

  const collectionRef2 = collection(firestore, "questions");
  onSnapshot(collectionRef2, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Real-time data:", data);
  });

  const updateQueue = () => {
    setLoading(true);
    try {
      const unsubscribe = onSnapshot(
        collection(firestore, "students"),
        (snapshot) => {
          const queueList = [];
          snapshot.forEach((doc) => {
            queueList.push({ id: doc.id, ...doc.data() });
          });
          setQueue(queueList);
          setLoading(false);
        }
      );
      return unsubscribe; // Return the unsubscribe function
    } catch (error) {
      console.error("Error updating queue: ", error);
      setError("Failed to update queue");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };
  const updateQuestions = () => {
    setLoading(true);
    try {
      const unsubscribe = onSnapshot(
        collection(firestore, "questions"),
        (snapshot) => {
          const questionsList = [];
          snapshot.forEach((doc) => {
            questionsList.push({ id: doc.id, ...doc.data() });
          });
          setQuestions(questionsList);
          setLoading(false);
        }
      );
      return unsubscribe; // Return the unsubscribe function
    } catch (error) {
      console.error("Error updating questions: ", error);
      setError("Failed to update questions");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const addToQuestions = async () => {
    if (!post) {
      setError("Please fill in question.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const standardizedUbit = ubit;
      await addDoc(collection(firestore, "questions"), {
        post,
        ubit: standardizedUbit,
      });
      await updateQuestions();
      setOpenModal2(false);
      resetForm();
    } catch (error) {
      console.error("Error adding question: ", error);
      setError("Failed to add question");
      setOpenSnackbar(true);
    }
  };

  const addToQueue = async () => {
    if (!name || !question || !category || !ubit) {
      setError("Please fill in all fields");
      setOpenSnackbar(true);
      return;
    }

    try {
      const standardizedUbit = ubit;
      const docRef = doc(collection(firestore, "students"), standardizedUbit);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setError("Student with this UBIT already exists");
        setOpenSnackbar(true);
        return;
      }

      await setDoc(docRef, {
        name,
        question,
        category,
        ubit: standardizedUbit,
      });

      await updateQueue();
      setOpenModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding student: ", error);
      setError("Failed to add student");
      setOpenSnackbar(true);
    }
  };

  const removeFromQueue = async (ubitToRemove) => {
    try {
      const docRef = doc(collection(firestore, "students"), ubitToRemove);
      await deleteDoc(docRef);
      await updateQueue();
    } catch (error) {
      console.error("Error removing from queue: ", error);
      setError("Failed to remove from queue");
      setOpenSnackbar(true);
    }
  };

  const removeFromQuestions = async (ubitToRemove) => {
    try {
      const docRef = doc(collection(firestore, "questions"), ubitToRemove);
      await deleteDoc(docRef);
      await updateQueue();
    } catch (error) {
      console.error("Error removing from questions: ", error);
      setError("Failed to remove from questions");
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setName("");
    setUbit("");
    setCategory("");
    setQuestion("");
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ pb: 29 }}>
      <StudentAppBar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Box display="flex" flexDirection="row" gap={4} sx={{ mt: 5, mb: 3 }}>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Add to Queue
          </Button>
          <Button variant="contained" onClick={() => setOpenModal2(true)}>
            Add to Public Forum
          </Button>
        </Box>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="enqueue-modal"
          aria-describedby="modal-for-entering-name-ubit-category"
        >
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
            <Typography variant="h6" mb={2}>
              Enter Details
            </Typography>

            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="UBIT"
              value={ubit}
              onChange={(e) => setUbit(e.target.value)}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="categorization-label">Categorization</InputLabel>
              <Select
                labelId="categorization-label"
                id="categorization"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Categorization"
              >
                <MenuItem value="Technical Difficulties">
                  Technical Difficulties
                </MenuItem>
                <MenuItem value="Debugging">Debugging</MenuItem>
                <MenuItem value="Conceptual Understanding">
                  Conceptual Understanding
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />

            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="contained" onClick={addToQueue}>
                Add to Queue
              </Button>
              <Button variant="outlined" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Modal
          open={openModal2}
          onClose={() => setOpenModal2(false)}
          aria-labelledby="enqueue-modal"
          aria-describedby="modal-for-entering-name-ubit-category"
        >
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
            <Typography variant="h6" mb={2}>
              Enter Details
            </Typography>

            <TextField
              label="UBIT"
              value={ubit}
              onChange={(e) => setUbit(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Post"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />

            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="contained" onClick={addToQuestions}>
                Add to Public Forum
              </Button>
              <Button variant="outlined" onClick={() => setOpenModal2(false)}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Box display="flex" flexDirection="row" gap={4} sx={{ mt: 5, mb: 3 }}>
          {/* Queue Box */}
          <Box width="300px" p={2} border="1px solid #333">
            <Typography
              variant="h6"
              bgcolor="#899499"
              borderRadius={1}
              sx={{ textAlign: "center", mb: 1 }}
            >
              Queue:
            </Typography>
            <Stack spacing={1}>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={2}
                >
                  <CircularProgress />
                </Box>
              ) : queue.length > 0 ? (
                queue.map((item) => (
                  <Box key={item.ubit} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          <strong>UBIT:</strong> {item.ubit}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography textAlign="center">Empty Queue</Typography>
              )}
            </Stack>
          </Box>

          {/* Public Forum Box */}
          <Box width="300px" mt={3} p={2} border="1px solid #333">
            <Typography
              variant="h6"
              bgcolor="#5986e5"
              borderRadius={1}
              sx={{ textAlign: "center", mb: 1 }}
            >
              Public Forum:
            </Typography>
            <Stack spacing={1}>
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={2}
                >
                  <CircularProgress />
                </Box>
              ) : questions.length > 0 ? (
                questions.map((item) => (
                  <Box key={item.post} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          <strong></strong> {item.post}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography textAlign="center">No Questions</Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
