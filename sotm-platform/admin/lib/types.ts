export type Message = {
  _id: string;
  title: string;
  speaker: string;
  size?: string;
  downloadUrl: string;
  imageUrl?: string;
  date: string;
  category: string[];
  isSeries: boolean;
  seriesTitle?: string;
  specialMeeting: boolean;
  specialMeetingName?: string;
  description?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
};

export type Speaker = {
  _id: string;
  name: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Series = {
  _id: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
};

export interface Admin {
  _id: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}
