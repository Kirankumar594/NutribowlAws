import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './config/dB.js';

import bannerRouter from './routes/BannerRouter.js';
import industrialRouter from "./routes/IndustrialRouter.js" 
import testimonialRouter from './routes/testimonialRoutes.js';
import storyRouter from './routes/StoryRouter.js';
import mealRoutes from "./routes/mealRoutes.js"
import weightGainMealRoutes from "./routes/weightGainMealRoutes.js"
import weightLossMealRoutes from "./routes/weightLossMealRoutes.js"


import facilitiesRouter from './routes/FacilitiesRouter.js';
import ourTeamRouter from './routes/OurTeamRouter.js';
import categoryRouter from './routes/CategoryRouter.js';
import productRouter from './routes/ProductRoutes.js'; 
import serviceRouter from './routes/ServiceRouter.js'; 
import contactRouter from './routes/contactRoutes.js'; 
// import authRouter from './routes/authRoutes.js';

import planRoutes from './routes/planRoutes.js'



import menuRouter from './routes/menuRoutes.js'

// sp
import checkoutRoutes from './routes/CheckoutRoute.js';
import authRouter from './routes/SignupRoute.js';

import expertRouter from './routes/expertRoutes.js'
import benefitsRouter from './routes/benefitsRoutes.js'
import solutionRouter from './routes/solutionRoutes.js'
import problemRouter from './routes/problemRoutes.js'
import specializationRouter from './routes/specializationRoutes.js' 
import aboutRouter from './routes/aboutRoutes.js'
import importanceRouter from './routes/importanceRoutes.js';
import MissionVisionRouter from './routes/missionVision.js';
import challengeRouter from './routes/challenges.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
connectDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/banner', bannerRouter);
app.use('/api/industrial',industrialRouter);
app.use('/api/testimonial', testimonialRouter);
app.use('/api/story', storyRouter);
app.use('/api/facilities', facilitiesRouter);
app.use('/api/our-team', ourTeamRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/service', serviceRouter);
app.use('/api/contacts', contactRouter); 
app.use('/api/auth', authRouter);
app.use('/api/mealplan', mealRoutes)
app.use("/api/weight-gain-meals", weightGainMealRoutes);
app.use("/api/weight-loss-meals", weightLossMealRoutes);

app.use("/api/plans", planRoutes);


// app.use('/api/auth', authRouter);
app.use('/api/checkout',checkoutRoutes)
app.use('/api/auth', authRouter);


app.use('/api/menu' , menuRouter);
app.use('/api/expert', expertRouter)
app.use('/api/benefits', benefitsRouter)
app.use('/api/solutions', solutionRouter)
app.use('/api/problem', problemRouter)
app.use('/api/specialization', specializationRouter);
app.use('/api/about', aboutRouter)
app.use('/api/importance', importanceRouter)
app.use('/api/missionvision',MissionVisionRouter);
app.use('/api/challenges', challengeRouter)
app.use('/uploads', express.static('uploads'));


// Test route
// app.get('/', (req, res) => {
//   res.send('🚀 Server is running!');
// });
app.use(express.static(path.join(__dirname, 'build'))); // Change 'build' to your frontend folder if needed

// Redirect all requests to the index.html file

app.get("*", (req, res) => {
  return  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);

});