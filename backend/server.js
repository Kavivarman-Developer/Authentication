import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs";




dotenv.config();

const port = process.env.PORT || 8080


const app = express()


// MiddleWare
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
const routeFiles = fs.readdirSync('./src/routes');

routeFiles.forEach((file) => {
    // Use dynamic import
    import(`./src/routes/${file}`).then((route) => {
        app.use("/api/v1", route.default);
    }).catch((error) => {
        console.error('Faild to load route file', error)
    });
})

const server = async () => {
    try {
        await connect();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

server();