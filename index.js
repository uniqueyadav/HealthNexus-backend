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
const prescriptionRoute = require("./Route/prescriptionRoute");

const app = express();

const PORT = process.env.PORT || 8000;
const isProduction = process.env.NODE_ENV === "production";
const MONGO_URL = isProduction ?
    process.env.MONGO_URL_PROD || process.env.MONGO_URL :
    process.env.MONGO_URL_LOCAL || process.env.MONGO_URL;

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_2,
    "https://healthnexusomega.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
].filter(Boolean);

app.use(express.json());

app.use(
    cors({
        origin: function(origin, callback) {
            // allows requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("CORS policy block: This origin is not allowed"));
            }
        },
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
app.use('/api/prescription', prescriptionRoute);

mongoose
    .connect(MONGO_URL)
    .then(() => console.log("MongoDB Connected Successfully 👍"))
    .catch((err) => console.log("MongoDB Connection Error ❌", err));

app.listen(PORT, () => {
    console.log(`Server Running on Port: ${PORT} 🚀`);
});