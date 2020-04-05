import path from "path";

require("dotenv-safe").config({
  allowEmptyValues: true,
  path: path.join(__dirname, "../../.env"),
  sample: path.join(__dirname, "../../.env.example")
});

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  secret : 'SeCrEtKeYfOrHaShInG',
  import : {
    api : process.env.IMPORT_KEY,
    secret : process.env.IMPORT_SECRET
  },
  mongo: {
    uri:
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI
  },
  client : {
    uri : process.env.CLIENT_URL
  },
  server : {
    uri : process.env.SERVER_URL
  }
};

export default config;
