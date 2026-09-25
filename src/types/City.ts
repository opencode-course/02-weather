export type GeoLocation = {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type City = GeoLocation & { id: number };
