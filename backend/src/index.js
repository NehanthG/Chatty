import express from "express"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import {connectDB} from "./lib/db.js"
import cors from "cors"
dotenv.config()
import path from "path"
import {app, server , io} from "./lib/socket.js"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

const PORT = process.env.PORT
const __dirname = path.resolve();
app.use(express.json({ limit: "10mb" }));   // adjust size as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 
  process.env.NODE_ENV === "development" ? "http://localhost:5173" : "*",
  credentials: true
  
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV==="production"){
  const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

}

server.listen(PORT,()=>{
    console.log("Server is running on port" + PORT);
    connectDB();

})