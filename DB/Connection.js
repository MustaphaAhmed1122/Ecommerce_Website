import mongoose from "mongoose";
const connDB = async () => {
  return await mongoose
    .connect(process.env.DB_STRRING)
    .then((result) => console.log("DB Working.........."))
    .catch((err) => console.log(`Catch connection DB Error ${err}`));
};
export default connDB;
