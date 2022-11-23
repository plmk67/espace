const production = {
  url: "https://espace-backend.herokuapp.com",
};
const development = {
  url: "https://espace-backend.herokuapp.com",
};
export const config =
  process.env.NODE_ENV === "development" ? development : production;
