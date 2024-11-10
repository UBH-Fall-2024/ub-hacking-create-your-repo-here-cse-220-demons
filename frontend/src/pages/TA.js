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
  query,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
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
  const [question, setQuestion] = useState(""); // State for the question input

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

  const removeFromQuestions = async (idToRemove) => {
    try {
      const docRef = doc(collection(firestore, "questions"), idToRemove);
      await deleteDoc(docRef);
      await updateQuestions();
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

  // Function to filter queue by category
  const getItemsByCategory = (category) => {
    return queue.filter((item) => item.category === category);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      gap={4}
      sx={{ pb: 29, mt: 5 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        flex={1}
      >
        <Typography variant="h4">CSE 220 Queue Manager</Typography>

        <Box
          width="400px"
          mt={3}
          sx={{ borderRadius: 3, p: 2, border: "1px solid #333" }}
        >
          {/* Fixed Title */}
          <Typography
            variant="h6"
            bgcolor="#899499"
            borderRadius={1}
            sx={{ textAlign: "center", mb: 1 }}
          >
            Queue:
          </Typography>

          {/* Scrollable List */}
          <Box
            sx={{
              height: "250px", // Adjust height as needed
              overflowY: "auto",
              paddingRight: 1, // Optional: add padding for scrollbar spacing
            }}
          >
            <Stack spacing={1}>
              {queue.length > 0 ? (
                queue.map((item) => (
                  <Box key={item.ubit} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          <strong>Name:</strong> {item.name}
                        </Typography>
                      </Stack>

                      <Typography variant="body2">
                        <strong>Ubit:</strong> {item.ubit}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Question:</strong> {item.question}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => removeFromQueue(item.ubit)}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography textAlign="center">Empty Queue</Typography>
              )}
            </Stack>
          </Box>
        </Box>

        {/* FOR YOU TO EDIT FORUM */}
        <Box
          width="400px"
          mt={3}
          sx={{ borderRadius: 3, p: 2, border: "1px solid #333" }}
        >
          {/* Fixed Title */}
          <Typography
            variant="h6"
            bgcolor="#899499"
            borderRadius={1}
            sx={{ textAlign: "center", mb: 1 }}
          >
            Public Forum:
          </Typography>

          {/* Scrollable List */}
          <Box
            sx={{
              height: "250px", // Adjust height as needed
              overflowY: "auto",
              paddingRight: 1, // Optional: add padding for scrollbar spacing
            }}
          >
            <Stack spacing={1}>
              {questions.length > 0 ? (
                questions.map((item, index) => (
                  <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                    {/* Stack for each row */}
                    <Stack spacing={0.5}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                      ></Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          <strong></strong> {item.post}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => removeFromQuestions(item.id)}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography textAlign="center">Empty Queue</Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Category-wise Queue Display */}
      <Box
        display="flex"
        width="400px"
        height="600px"
        flexDirection="column"
        gap={3}
        flex={1}
        sx={{ mt: 6, mr: 10 }}
      >
        {/* Technical Difficulties */}
        <Box>
          <Typography
            bgcolor="#89CFF0"
            variant="h6"
            mb={1}
            sx={{
              textAlign: "center",
              border: "1px solid #333",
              borderRadius: 2,
              p: 0.5,
            }}
          >
            Technical Difficulties (
            {getItemsByCategory("Technical Difficulties").length})
          </Typography>
          <Box
            height="200px"
            sx={{
              border: "1px solid #333",
              borderRadius: 2,
              overflowY: "auto",
            }}
          >
            <Stack spacing={1}>
              {getItemsByCategory("Technical Difficulties").length > 0 ? (
                getItemsByCategory("Technical Difficulties").map(
                  (item, index) => (
                    <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                      <Typography variant="body2">
                        <strong>Name:</strong> {item.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>UBIT:</strong> {item.ubit}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Question:</strong> {item.question}
                      </Typography>
                    </Box>
                  )
                )
              ) : (
                <Typography align="center">Empty Queue</Typography>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Debugging */}
        <Box>
          <Typography
            variant="h6"
            bgcolor="#FFDBBB"
            mb={1}
            sx={{
              textAlign: "center",
              border: "1px solid #333",
              borderRadius: 2,
              p: 0.5,
            }}
          >
            Debugging ({getItemsByCategory("Debugging").length})
          </Typography>
          <Box
            height="200px"
            sx={{
              border: "1px solid #333",
              borderRadius: 2,
              overflowY: "auto",
            }}
          >
            <Stack spacing={1}>
              {getItemsByCategory("Debugging").length > 0 ? (
                getItemsByCategory("Debugging").map((item, index) => (
                  <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {item.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>UBIT:</strong> {item.ubit}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Question:</strong> {item.question}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography align="center">Empty Queue</Typography>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Conceptual Understanding */}
        <Box>
          <Typography
            variant="h6"
            bgcolor="#64e3a1"
            mb={1}
            sx={{
              textAlign: "center",
              border: "1px solid #333",
              borderRadius: 2,
              p: 0.5,
            }}
          >
            Conceptual Understanding (
            {getItemsByCategory("Conceptual Understanding").length})
          </Typography>
          <Box
            height="200px"
            sx={{
              border: "1px solid #333",
              borderRadius: 1,
              overflowY: "auto",
            }}
          >
            <Stack spacing={1}>
              {getItemsByCategory("Conceptual Understanding").length > 0 ? (
                getItemsByCategory("Conceptual Understanding").map(
                  (item, index) => (
                    <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                      <Typography variant="body2">
                        <strong>Name:</strong> {item.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>UBIT:</strong> {item.ubit}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Question:</strong> {item.question}
                      </Typography>
                    </Box>
                  )
                )
              ) : (
                <Typography align="center">Empty Queue</Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={error}
      />
    </Box>
  );
}
