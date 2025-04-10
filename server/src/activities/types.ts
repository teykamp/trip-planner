type Reactions = {
  [emoji: string]: number;
};

export type Activity = {
  id: string;
  title: string;
  dateStart: string;
  dateEnd: string;
  description: string;
  reactions: Reactions;
  interestedPeople: string[];
};