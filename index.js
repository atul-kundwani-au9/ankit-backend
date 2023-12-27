import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin:['login-signup-chi.vercel.app'],
    methods:["POST"],
    credentials: true,
}));

const mongoURI = "mongodb+srv://aniket1997:C563ramdashati@cluster0.c0h0xtd.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db connected');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error.message);
  });

// Create schema
const userScema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    mobile: String,
});
const User = new mongoose.model("User", userScema);

// Routes
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const loginUser = await User.findOne({ email: email });
        if (loginUser) {
            if (password === loginUser.password) {
                res.send({ message: "Login Done" });
            } else {
                res.send({ message: "Wrong Password" });
            }
        } else {
            res.send({ message: "User Not registered" });
        }
    } catch (error) {
        res.send({ message: 'Error', error: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            res.send({ message: 'User Already Exists' });
        } else {
            const newUser = new User({
                username,
                email,
                password
            });

            await newUser.save();
            res.send({ message: 'Done' });
        }
    } catch (error) {
        res.send({ message: 'Error', error: error.message });
    }
});

app.listen(process.env.PORT || 9002, () => {
    console.log(`BE started at port ${process.env.PORT || 9002}`);
});
