import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from './Routes/auth.js'
import userRoutes from './Routes/user.js'
import doctorRoutes from './Routes/doctor.js'
import reviewRoutes from './Routes/review.js'
import bookingRoute from './Routes/booking.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: ["http://localhost:5173", "https://medicare-booking-website.vercel.app"], 
    credentials: true
}

app.get("/", (req, res) => {
    res.send("API is working")
})

//database connection
mongoose.set('strictQuery', false)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongodb database is connected")
    } catch (error) {
        console.log("Mongodb database connection failed:", error.message)
        console.log("Full error:", error)
        process.exit(1)
    }
}

//middleware   
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/doctors', doctorRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/bookings', bookingRoute)

app.listen(port, () => {
    connectDB();
    console.log("Server is running on port: " + port)
})