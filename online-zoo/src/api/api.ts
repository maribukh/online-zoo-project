import type { IPet, IFeedback } from '../types';

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Something went wrong. Please, refresh the page');
  }
  return (await response.json()) as T;
}

const BASE_URL =
  'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';

export const API = {
  getPets: () => fetchData<IPet[]>(`${BASE_URL}/pets`),

  getPetByID: (id: string) => fetchData<IPet>(`${BASE_URL}/pets/${id}`),

  getFeedbacks: () => fetchData<IFeedback[]>(`${BASE_URL}/feedbacks`),
};
