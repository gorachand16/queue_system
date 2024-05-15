// Import required modules
const express = require('express');
const userRouter =require("./api/patients/patient_router");
// Initialize Express app
const app = express();
const PORT = 3000; // Choose a port for your server
app.use("/patients", userRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
