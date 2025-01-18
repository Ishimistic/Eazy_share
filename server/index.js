import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import router from "./routes/routes.js";
import DBConnection from "./database/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8090;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// app.use('/files', express.static('public/uploads'));
DBConnection();

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    // console.error(err.stack);
    res.status(500).send('Something broke!');
});