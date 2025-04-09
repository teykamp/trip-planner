import type { Activity } from "./types";
export const activities: Activity[] = [
  {
    "title": "Astro Campfire",
    "dateStart": "2025-04-15",
    "dateEnd": "2025-04-17",
    "description": "A chill hangout under the stars.",
    "reactions": {
      "🔥": 3,
      "👍": 2,
      "❤️": 5
    },
    "interestedPeople": ["alice@example.com", "bob@example.com"]
  },
  {
    "title": "Rocket Launch Party",
    "dateStart": "2025-05-01",
    "dateEnd": "2025-05-01",
    "description": "We launch a hobby rocket and grill burgers.",
    "reactions": {
      
    },
    "interestedPeople": ["carol@example.com"]
  }
]
