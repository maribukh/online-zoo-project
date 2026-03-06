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
