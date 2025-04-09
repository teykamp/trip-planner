"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const constants_1 = require("./constants");
const activities_1 = require("./activities/activities");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use(express_1.default.json());
// Get all activities
app.get("/activities", (req, res) => {
    res.json(activities_1.activities);
});
// // update activities
app.post('/activities/update', (req, res) => {
    const { title, dateStart, reactions } = req.body;
    const activity = activities_1.activities.find((activity) => activity.title === title && activity.dateStart === dateStart);
    if (!activity) {
        res.status(404).json({ message: "Activity not found" });
        return;
    }
    activity.reactions = reactions;
    res.status(200).json({ message: "Activity reactions updated successfully" });
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
    console.log(`Available activities: ${activities_1.activities.length}`);
});
