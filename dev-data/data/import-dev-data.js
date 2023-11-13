const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const Tour = require('./../../model/tourModel.js');
const DB = process.env.MONGODB_CONNECTION;
const port = process.env.PORT || 5000;
mongoose.connect(DB).then(con => {
  // console.log(con.connections);
  console.log('connected');
});
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data loadded successfully to DB');
  } catch (error) {
    console.log(error);
  }
  //   process.exit();
};
const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
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
