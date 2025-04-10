import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { LOCALHOST_PORT } from "./constants";
import { activities } from "./activities/activities";
import cors from 'cors';

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());
const corsOptions = {
  origin: "https://trip-planner-front-end.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Date",
    "X-Api-Version",
    "Authorization"
  ],
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// Get all activities
app.get("/activities", (req: Request, res: Response) => {
  res.json(activities);
});

// update reaction
app.post("/activities/reaction", (req: Request, res: Response) => {
  const { activityId, emoji, action } = req.body;
  
  if (!activityId || !emoji || !['increment', 'decrement'].includes(action)) {
    res.status(400).json({ message: "Invalid request parameters" });
    return;
  }
  
  const activity = activities.find((activity) => activity.id === activityId);
  
  if (!activity) {
    res.status(404).json({ message: "Activity not found" });
    return;
  }
  
  if (!activity.reactions[emoji]) {
    activity.reactions[emoji] = 0;
  }
  
  if (action === 'increment') {
    activity.reactions[emoji]++;
  } else if (action === 'decrement') {
    if (activity.reactions[emoji] > 0) {
      activity.reactions[emoji]--;
    }
    
    if (activity.reactions[emoji] === 0) {
      delete activity.reactions[emoji];
    }
  }
  
  console.log(`Activity ID: ${activityId}, Emoji: ${emoji}, Action: ${action}`);
  res.status(200).json({ 
    message: "Activity reaction updated successfully",
    updatedReactions: activity.reactions
  });
});

// update interested
app.post("/activities/interested", (req: Request, res: Response) => {
  const { title, dateStart, interestedPersonData } = req.body;
  const activity = activities.find(
    (activity) => activity.title === title && activity.dateStart === dateStart
  );
  if (!activity) {
    res.status(404).json({ message: "Activity not found" });
    return;
  }
  activity.interestedPeople.push(interestedPersonData);
  res.status(200).json({ message: "Activity interested people updated successfully" });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
  });
}

const PORT = Number(process.env.PORT) || LOCALHOST_PORT;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Available activities: ${activities.length}`);
});
