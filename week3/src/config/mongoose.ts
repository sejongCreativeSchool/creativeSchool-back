import mongoose from "mongoose";
import config from "./vars";
/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */

mongoose.connection.on("error", err => {
  process.exit(-1);
});

// print mongoose logs in dev env
if (config.env === "development") {
  // mongoose.set("debug", true);
}
export const connect = () => {
  console.log(config.mongo.uri);
  
  mongoose.connect(config.mongo.uri, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
  });

  
  return mongoose.connection;
};
