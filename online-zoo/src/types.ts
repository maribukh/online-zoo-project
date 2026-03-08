export enum PetKind {
  Panda = 'Panda',
  Eagle = 'Eagle',
  Gorilla = 'Gorilla',
  Lemur = 'Lemur',
  Alligator = 'Alligator',
  Lion = 'Lion',
  Koala = 'Koala',
  Tiger = 'Tiger',
}

// interfaces for Animals

export interface IPet {
  id: string;
  name: string;
  kind: PetKind;
  image: string;
  description: string;
  location: string;
  details?: string;
}

export interface IFeedback {
  id: string;
  name: string;
  date: string;
  text: string;
  city: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface IDonation {
  amount: number;
  petId: string;
  userName: string;
  userEmail: string;
}

// for Zoo Page

export interface IPetDetail {
  id: number;
  commonName: string;
  scientificName: string;
  type: string;
  size: string;
  diet: string;
  habitat: string;
  range: string;
  latitude: string;
  longitude: string;
  description: string;
  detailedDescription: string;
}

export interface CameraItem {
  id: number;
  petId: number;
  text: string;
}

export interface PetAsset {
  img: string;
  icon: string;
  link: string;
  mainVideo: string;
  cams: string[];
}

interface LeafletMap {
  setView(latlng: [number, number], zoom: number): LeafletMap;
}
interface LeafletMarker {
  addTo(map: LeafletMap): LeafletMarker;
  bindPopup(html: string): LeafletMarker;
  openPopup(): LeafletMarker;
}
export interface LeafletStatic {
  map(id: string): LeafletMap;
  tileLayer(
    url: string,
    options: { attribution: string },
  ): { addTo(map: LeafletMap): void };
  marker(latlng: [number, number]): LeafletMarker;
}
