import { Box, Stack, Typography, Button, Snackbar, Modal, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useState } from 'react';

export default function QueueManager() {
  const [queue, setQueue] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [ubit, setUbit] = useState('');
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState(''); // State for the question input

  const enqueueItem = () => {
    if (!name || !ubit || !category || !question) {
      setError('Please fill in all fields');
      setOpenSnackbar(true);
      return;
    }
    const item = { name, ubit, category, question }; // Include question in the item
    setQueue([...queue, item]);
    setOpenModal(false); // Close modal after adding to queue
    setName('');
    setUbit('');
    setCategory('');
    setQuestion(''); // Reset question input
  };

  const dequeueItem = () => {
    if (queue.length === 0) {
      setError('Queue is empty');
      setOpenSnackbar(true);
      return;
    }
    setQueue(queue.slice(1)); // Remove the first item
  };

  // Function to filter queue by category
  const getItemsByCategory = (category) => {
    return queue.filter(item => item.category === category);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="flex-start" gap={4} sx = {{pb: 29, mt:5}}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} flex={1}>
        <Typography variant="h4">CSE 220 Queue Manager</Typography>

        {/* Button to open modal */}
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Enqueue
        </Button>
        <Button variant="contained" onClick={dequeueItem}>Dequeue</Button>

        {/* Modal for entering name, UBIT, category, and question */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="enqueue-modal"
          aria-describedby="modal-for-entering-name-ubit-category"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: 3,
              borderRadius: 2,
              boxShadow: 24,
              width: 400,
            }}
          >
            <Typography variant="h6" mb={2}>Enter Details</Typography>
            
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
                <MenuItem value="Technical Difficulties">Technical Difficulties</MenuItem>
                <MenuItem value="Debugging">Debugging</MenuItem>
                <MenuItem value="Conceptual Understanding">Conceptual Understanding</MenuItem>
              </Select>
            </FormControl>

            {/* Question Box */}
            <TextField
              label="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              fullWidth
              multiline
              rows={4}  // Adjust this based on how large you want the question box
              margin="normal"
            />

            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="contained" onClick={enqueueItem}>Add to Queue</Button>
              <Button variant="outlined" onClick={() => setOpenModal(false)}>Cancel</Button>
            </Stack>
          </Box>
        </Modal>

    <Box width="400px" mt={3} sx={{ borderRadius: 3, p: 2, border: "1px solid #333" }}>
        {/* Fixed Title */}
        <Typography variant="h6" bgcolor='#899499'  borderRadius={1} sx={{ textAlign: "center", mb: 1 }}>Queue:</Typography>

        {/* Scrollable List */}
        <Box
            sx={{
            height: '250px',  // Adjust height as needed
            overflowY: 'auto',
            paddingRight: 1  // Optional: add padding for scrollbar spacing
            }}
        >
            <Stack spacing={1}>
            {queue.length > 0 ? (
                queue.map((item, index) => (
                <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                    {/* Stack for each row */}
                    <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2"><strong>Name:</strong> {item.name}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2"><strong>UBIT:</strong> {item.ubit}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2"><strong>Category:</strong> {item.category}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2"><strong>Question:</strong> {item.question}</Typography>
                    </Stack>
                    </Stack>
                </Box>
                ))
            ) : (
                <Typography textAlign= 'center'>Empty Queue</Typography>
            )}
            </Stack>
        </Box>
    </Box>

    {/* FOR YOU TO EDIT FORUM */}
    <Box width="400px" mt={3} sx={{ borderRadius: 3, p: 2, border: "1px solid #333" }}>
        {/* Fixed Title */}
        <Typography variant="h6" bgcolor='#899499'  borderRadius={1} sx={{ textAlign: "center", mb: 1 }}>Queue:</Typography>

        {/* Scrollable List */}
        <Box
            sx={{
            height: '250px',  // Adjust height as needed
            overflowY: 'auto',
            paddingRight: 1  // Optional: add padding for scrollbar spacing
            }}
        >
            <Stack spacing={1}>
            {queue.length > 0 ? (
                queue.map((item, index) => (
                <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
                    {/* Stack for each row */}
                    <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2"><strong>Name:</strong> {item.name}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2"><strong>UBIT:</strong> {item.ubit}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2"><strong>Category:</strong> {item.category}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2"><strong>Question:</strong> {item.question}</Typography>
                    </Stack>
                    </Stack>
                </Box>
                ))
            ) : (
                <Typography textAlign= 'center'>Empty Queue</Typography>
            )}
            </Stack>
        </Box>
    </Box>

      </Box>

      {/* Category-wise Queue Display */}
<Box display="flex" width='400px' height='600px'  flexDirection="column" gap={3} flex={1} sx={{ mt: 6, mr: 10 }}>
  {/* Technical Difficulties */}
  <Box>
    <Typography bgcolor="#89CFF0" variant="h6" mb={1} sx={{ textAlign: "center", border: "1px solid #333", borderRadius: 2, p: 0.5 }}>
      Technical Difficulties ({getItemsByCategory("Technical Difficulties").length})
    </Typography>
    <Box width='655px' height='200px' sx={{ border: "1px solid #333", borderRadius: 2, overflowY: 'auto' }}>
      <Stack spacing={1}>
        {getItemsByCategory("Technical Difficulties").length > 0 ? (
          getItemsByCategory("Technical Difficulties").map((item, index) => (
            <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
              <Typography variant="body2"><strong>Name:</strong> {item.name}</Typography>
              <Typography variant="body2"><strong>UBIT:</strong> {item.ubit}</Typography>
              <Typography variant="body2"><strong>Question:</strong> {item.question}</Typography>
            </Box>
          ))
        ) : (
          <Typography align="center">Empty Queue</Typography>
        )}
      </Stack>
    </Box>
  </Box>

  {/* Debugging */}
  <Box>
    <Typography variant="h6" bgcolor='#FFDBBB' mb={1} sx={{ textAlign: "center", border: "1px solid #333", borderRadius: 2, p: 0.5 }}>
      Debugging ({getItemsByCategory("Debugging").length})
    </Typography>
    <Box width='655px' height='200px' sx={{ border: "1px solid #333", borderRadius: 2, overflowY: 'auto' }}>
      <Stack spacing={1}>
        {getItemsByCategory("Debugging").length > 0 ? (
          getItemsByCategory("Debugging").map((item, index) => (
            <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
              <Typography variant="body2"><strong>Name:</strong> {item.name}</Typography>
              <Typography variant="body2"><strong>UBIT:</strong> {item.ubit}</Typography>
              <Typography variant="body2"><strong>Question:</strong> {item.question}</Typography>
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
    <Typography variant="h6" bgcolor='#64e3a1' mb={1} sx={{ textAlign: "center", border: "1px solid #333", borderRadius: 2, p: 0.5 }}>
      Conceptual Understanding ({getItemsByCategory("Conceptual Understanding").length})
    </Typography>
    <Box width='655px' height='200px' sx={{border: "1px solid #333", borderRadius: 1, overflowY: 'auto' }}>
      <Stack spacing={1}>
        {getItemsByCategory("Conceptual Understanding").length > 0 ? (
          getItemsByCategory("Conceptual Understanding").map((item, index) => (
            <Box key={index} p={1} bgcolor="#f0f0f0" borderRadius={1}>
              <Typography variant="body2"><strong>Name:</strong> {item.name}</Typography>
              <Typography variant="body2"><strong>UBIT:</strong> {item.ubit}</Typography>
              <Typography variant="body2"><strong>Question:</strong> {item.question}</Typography>
            </Box>
          ))
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
