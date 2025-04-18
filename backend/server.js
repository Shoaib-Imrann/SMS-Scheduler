import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser';
import emailRouter from './routes/emailRoutes.js'
import userRouter from './routes/userRoutes.js'
import campaignRouter from './routes/campaignRoutes.js'
import shopperRouter from './routes/shopperRoutes.js'
import paymentRouter from './routes/paymentRoutes.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions = {
  origin: function (origin, callback) {
    // If there's no origin (for Postman, etc.), or if the origin is in the allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow it
    } else {
      callback(new Error('Not allowed by CORS')); // Block it
    }
  },
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API Working!!");
});

app.use("/api/email", emailRouter);
app.use("/api/user", userRouter);
app.use("/api/shopper", shopperRouter);
app.use("/api/campaign", campaignRouter);
app.use("/api/payment", paymentRouter);

app.listen(port, () => {
  console.log(`Server started on PORT : ${port}`);
});
