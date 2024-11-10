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
  AppBar,
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
import ButtonAppBar from "./AppBar";

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
      return unsubscribe;
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
      return unsubscribe;
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
    <Box display="flex" flexDirection="column" sx={{ pb: 29 }}>
      <ButtonAppBar />

      <Box
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        gap={4}
        sx={{ mt: 5, px: 4 }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          flex={1}
        >
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
              Queue ({queue.length}):
            </Typography>

            {/* Scrollable List */}
            <Box
              sx={{
                height: "250px",
                overflowY: "auto",
                paddingRight: 1,
              }}
            >
              <Stack spacing={1}>
                {queue.length > 0 ? (
                  queue.map((item, index) => (
                    <Box
                      key={item.ubit}
                      p={1}
                      borderRadius={1}
                      sx={{
                        bgcolor:
                          item.category === "Debugging"
                            ? "#FFDBBB"
                            : item.category === "Technical Difficulties"
                            ? "#89CFF0"
                            : item.category === "Conceptual Understanding"
                            ? "#64e3a1"
                            : "#f0f0f0",
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">
                            <strong>Position:</strong> {index + 1}
                          </Typography>
                          <Typography variant="body2">
                            <strong>UBIT:</strong> {item.ubit}
                          </Typography>
                        </Stack>
                        <Typography variant="body2">
                          <strong>Category:</strong> {item.category}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => removeFromQueue(item.id)}
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

          {/* Forum Section */}
          <Box
            width="400px"
            mt={3}
            sx={{ borderRadius: 3, p: 2, border: "1px solid #333" }}
          >
            <Typography
              variant="h6"
              bgcolor="#899499"
              borderRadius={1}
              sx={{ textAlign: "center", mb: 1 }}
            >
              Public Forum ({questions.length}):
            </Typography>

            <Box
              sx={{
                height: "250px",
                overflowY: "auto",
                paddingRight: 1.0,
              }}
            >
              <Stack spacing={1}>
                {questions.length > 0 ? (
                  questions.map((item, index) => (
                    <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                      <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">
                            <strong>UBIT:</strong> {item.ubit}
                          </Typography>
                        </Stack>
                        <Typography variant="body2">
                          <strong>Question:</strong> {item.post}
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
        >
          {/* Technical Difficulties */}
          <Box>
            <Typography
              bgcolor="#89CFF0"
              variant="h6"
              mb={0.0}
              sx={{
                textAlign: "center",
                border: "1px solid #333",
                borderRadius: 2.0,
                p: 0.0,
              }}
            >
              Technical Difficulties (
              {getItemsByCategory("Technical Difficulties").length})
            </Typography>
            <Box
              height="190px"
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
              mb={0.0}
              sx={{
                textAlign: "center",
                border: "1px solid #333",
                borderRadius: 2,
                p: 0.0,
              }}
            >
              Debugging ({getItemsByCategory("Debugging").length})
            </Typography>
            <Box
              height="190px"
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
              mb={0.0}
              sx={{
                textAlign: "center",
                border: "1px solid #333",
                borderRadius: 2.0,
                p: 0.0,
              }}
            >
              Conceptual Understanding (
              {getItemsByCategory("Conceptual Understanding").length})
            </Typography>
            <Box
              height="190px"
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
    </Box>
  );
}
