const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const tourModel = require('../../models/tourModel.js');
const reviewModel = require('../../models/reviewModel.js');
const userModel = require('../../models/userModel.js');

const DB = process.env.MONGODB_CONNECTION;
// const port = process.env.PORT || 5000;
mongoose.connect(DB).then(con => {
  // console.log(con.connections);
  console.log('connected');
});
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await tourModel.create(tours);
    await userModel.create(users, { validateBeforeSave: false });
    await reviewModel.create(reviews);

    console.log('data loadded successfully to DB');
  } catch (error) {
    console.log(error);
  }
  //   process.exit();
};
const deleteAllData = async () => {
  try {
    await tourModel.deleteMany();
    await userModel.deleteMany();
    await reviewModel.deleteMany();

    // console.log(process.argv);
    console.log('data deleted from DB');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAllData();
}
