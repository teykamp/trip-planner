type Reactions = {
  [emoji: string]: number;
};

export type Activity = {
  title: string;
  dateStart: string;
  dateEnd: string;
  description: string;
  reactions: Reactions;
  interestedPeople: string[];
};