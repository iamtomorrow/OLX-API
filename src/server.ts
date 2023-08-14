
import multer from 'multer';
import { SERVER_PORT, MONGODB_DATABASE_URL } from './envs';
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';
import mongoose from 'mongoose';
import { router } from './router';
import dotenv from 'dotenv';
import express, { NextFunction, Response, Request } from 'express';
import path from 'path';
import { request } from 'http';

const server = express( );
server.use(cors());

dotenv.config( );

mongoose.connect(MONGODB_DATABASE_URL as string);
mongoose.connection.on("error", ( ) => {
    console.log("Error trying to connect to mongodb!");
})

const storage = multer.memoryStorage();
multer({ storage });

server.use(router);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "../public")));

server.listen( SERVER_PORT, ( ) => {
    console.log("Server is running at ", SERVER_PORT);
});
