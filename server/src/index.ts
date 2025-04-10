import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { LOCALHOST_PORT } from "./constants";
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import type { Activity } from "./activities/types";

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

const ACTIVITIES_FILE_PATH = path.join(__dirname, 'activities', 'activities.json');

const readActivitiesFromFile = (): Activity[] => {
  try {
    const data = fs.readFileSync(ACTIVITIES_FILE_PATH, 'utf8');
    return JSON.parse(data) as Activity[];
  } catch (error) {
    console.error('Error reading activities file:', error);
    return [];
  }
}

const writeActivitiesToFile = (activities: Activity[]) =>{
  try {
    fs.writeFileSync(ACTIVITIES_FILE_PATH, JSON.stringify(activities, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing activities to file:', error);
  }
}

// Get all activities
app.get("/activities", (req: Request, res: Response) => {
  const activities = readActivitiesFromFile();
  res.json(activities);
});

// update reaction
app.post("/activities/reaction", (req: Request, res: Response) => {
  const { activityId, emoji, action } = req.body;
  
  if (!activityId || !emoji || !['increment', 'decrement'].includes(action)) {
    res.status(400).json({ message: "Invalid request parameters" });
    return;
  }
  
  const activities = readActivitiesFromFile();
  
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
  
  writeActivitiesToFile(activities);
  
  res.status(200).json({
    message: "Activity reaction updated successfully",
    updatedReactions: activity.reactions
  });
});

// update interested
app.post("/activities/interested", (req: Request, res: Response) => {
  const { title, dateStart, interestedPersonData } = req.body;
  
  const activities = readActivitiesFromFile();
  
  const activity = activities.find(
    (activity) => activity.title === title && activity.dateStart === dateStart
  );
  
  if (!activity) {
    res.status(404).json({ message: "Activity not found" });
    return;
  }
  
  activity.interestedPeople.push(interestedPersonData);
  
  // Write updated activities to file
  writeActivitiesToFile(activities);
  
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
});