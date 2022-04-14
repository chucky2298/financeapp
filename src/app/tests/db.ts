import Mongoose from "mongoose";
import config from "../config/var/index";

export const connectDatabase = async () => {
  await Mongoose.connect(config.databaseUrl);
};

export const closeDatabase = async () => {
  await Mongoose.connection.dropDatabase();
  await Mongoose.connection.close();
};

export const clearDatabaseStart = async () => {
  const collections = Mongoose.connection.collections;
  for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
  }
};

export const clearDatabaseEnd = async () => {
  const collections = Mongoose.connection.collections;
  for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
  }
};
