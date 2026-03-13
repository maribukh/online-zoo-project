async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Something went wrong. Please, refresh the page');
    }
    return (await response.json());
}
const BASE_URL = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/';
export const API = {
    getPets: () => fetchData(BASE_URL + 'pets'),
    getPetByID: (id) => fetchData(BASE_URL + 'pets/' + id),
    getFeedbacks: () => fetchData(BASE_URL + 'feedback'),
};
//# sourceMappingURL=api.js.map