export type Itinerary = {
  trip: {
    startDate: string;
    endDate: string;
    travelers: number;
    homeTimezone: string;
  };
  days: Day[];
};

export type Day = {
  date: string;
  city: string;
  hotel?: {
    name: string;
    address: string;
    addressJa?: string;
    checkIn?: string;
    confirmation?: string;
  };
  stops: Stop[];
  notes?: string;
};

export type Stop = {
  id: string;
  name: string;
  nameJa?: string;
  type: "sight" | "food" | "shop" | "transit" | "free";
  start?: string;
  end?: string;
  address?: string;
  addressJa?: string;
  lat?: number;
  lng?: number;
  reservation?: {
    required: boolean;
    booked: boolean;
    confirmation?: string;
    deadline?: string;
    notes?: string;
  };
  notes?: string;
};
