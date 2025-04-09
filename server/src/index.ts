import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { LOCALHOST_PORT } from "./constants";
import { activities } from "./activities/activities";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());

// Get all activities
app.get("/activities", (req: Request, res: Response) => {
  res.json(activities);
});

// // update activities
// app.post('/activities/update', (req: Request, res: Response) => {
//   const { title, dateStart, reactions } = req.body;

//   const activity = activities.find((activity) => activity.title === title && activity.dateStart === dateStart);

//   if (!activity) {
//     return res.status(404).json({ message: "Activity not found" });
//   }

//   activity.reactions = reactions;

//   return res.status(200).json({ message: "Activity reactions updated successfully" });
// });

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
