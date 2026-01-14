import express from "express";
import dotenv from "dotenv";
import rateLimiter from './middleware/rateLimiter.js'
import transactionRoutes from "./routes/transactionRoutes.js";
import {initDB} from './config/db.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(rateLimiter)
app.use(express.json());

app.use("/api/transactions",transactionRoutes)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
