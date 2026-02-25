require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const adminRoute = require("./Route/adminRoute");
const doctorRoute = require("./Route/doctorRoute");
const regRoute = require("./Route/regRoute");
const appRoute = require("./Route/appRoute");
const newsRoute = require("./Route/newsRoute");
const feedRoute = require("./Route/feedRoute");

const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(express.json());

app.use(
    cors({
        origin: CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("HealthNexus Backend Running 🚀");
});

app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/reg", regRoute);
app.use("/api/app", appRoute);
app.use("/api/news", newsRoute);
app.use("/api/feed", feedRoute);

mongoose
    .connect(MONGO_URL)
    .then(() => console.log("MongoDB Connected Successfully 👍"))
    .catch((err) => console.log("MongoDB Connection Error ❌", err));

app.listen(PORT, () => {
    console.log(`Server Running on Port: ${PORT} 🚀`);
});