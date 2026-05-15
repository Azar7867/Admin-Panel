const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const dynamicRoutes = require("./routes/dynamicRoutes");
const percentageRoutes = require("./routes/percentageRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const blogRoutes = require("./routes/blogRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const leadRoutes = require("./routes/leadRoutes");
const graphRoutes = require("./routes/graphRoutes");
const loginRoutes = require("./routes/loginRoutes");
dotenv.config();


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/dynamic", dynamicRoutes);
app.use("/api/percentage", percentageRoutes);
app.use("/api/details", detailsRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api", blogRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/invoices", invoiceRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api/login-hours", loginRoutes);
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
