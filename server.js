const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const DB = process.env.MONGODB_CONNECTION;
const port = process.env.PORT || 5000;
const app = require('./app');
mongoose.connect(DB).then(con => {
  // console.log(con.connections);
  console.log('connected');
  app.listen(port, () => {
    console.log(`server is running at port ${port}`);
  });
});
// console.log(app.get('env'));
// console.log(process.env.PORT);
