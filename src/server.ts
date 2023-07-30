
import multer from 'multer';
import { SERVER_PORT, MONGODB_DATABASE_URL } from './envs';
import cors from 'cors';
import mongoose from 'mongoose';
import { router } from './router';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

const server = express( );
dotenv.config( );

mongoose.connect(MONGODB_DATABASE_URL as string);
mongoose.connection.on("error", ( ) => {
    console.log("Error trying to connect to mongodb!");
})

const storage = multer.memoryStorage();
multer({ storage });

server.use(router);
server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, "../public")));

server.listen( SERVER_PORT, ( ) => {
    console.log("Server is running at ", SERVER_PORT);
});
