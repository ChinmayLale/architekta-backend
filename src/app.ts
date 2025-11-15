import express, { ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { globalErrorHandler } from './utils/apiError';
import { authRouter } from './routes/auth.route';
import { ModelRouter } from './routes/model.route';
import { projectRouter } from './routes/project.route';
import CodeRouter from './routes/code.route';
import { ControllerRoute } from './routes/controller.route';
import { userRouter } from './routes/user.route';


const app = express();

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms')); 

app.use(morgan('dev'));
app.use(cors({
    origin: process.env['CORS_ORIGIN'] || "*",
    credentials: true
}));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get('/ping', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Pong | Server is running",
        error: [],
        data: null
    });
})



// Auth Rourter for User 

app.use("/api/v1/auth", authRouter);


// User Router 
app.use("/api/v1/user", userRouter  );




// Model Router for ML Models

app.use("/api/v1/models", ModelRouter);


// Create Controller Router
app.use("/api/v1/api", ControllerRoute);




// Project Router for Projects

app.use("/api/v1/projects", projectRouter);



// Code Controllers 

app.use("/api/v1/code", CodeRouter);





app.use(globalErrorHandler);
export { app };
