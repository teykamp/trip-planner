"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const constants_1 = require("./constants");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use(express_1.default.json());
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
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
const ACTIVITIES_FILE_PATH = path_1.default.join(__dirname, 'activities', 'activities.json');
const readActivitiesFromFile = () => {
    try {
        const data = fs_1.default.readFileSync(ACTIVITIES_FILE_PATH, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading activities file:', error);
        return [];
    }
};
const writeActivitiesToFile = (activities) => {
    try {
        fs_1.default.writeFileSync(ACTIVITIES_FILE_PATH, JSON.stringify(activities, null, 2), 'utf8');
    }
    catch (error) {
        console.error('Error writing activities to file:', error);
    }
};
// Get all activities
app.get("/activities", (req, res) => {
    const activities = readActivitiesFromFile();
    res.json(activities);
});
// update reaction
app.post("/activities/reaction", (req, res) => {
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
    }
    else if (action === 'decrement') {
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
app.post("/activities/interested", (req, res) => {
    const { title, dateStart, interestedPersonData } = req.body;
    const activities = readActivitiesFromFile();
    const activity = activities.find((activity) => activity.title === title && activity.dateStart === dateStart);
    if (!activity) {
        res.status(404).json({ message: "Activity not found" });
        return;
    }
    activity.interestedPeople.push(interestedPersonData);
    writeActivitiesToFile(activities);
    res.status(200).json({ message: "Activity interested people updated successfully" });
});
// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(__dirname + "/public/"));
    app.get("*", (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    });
}
const PORT = Number(process.env.PORT) || constants_1.LOCALHOST_PORT;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
