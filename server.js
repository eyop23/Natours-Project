const dotenv = require('dotenv');
const mongoose = require('mongoose');
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const DB = process.env.MONGODB_CONNECTION;
const app = require('./app');
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    // console.log(con.connections);
    console.log('connected');
  });
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION');
  console.log(err.name, err.message);
  // first close the server then exit the application
  server.close(() => {
    process.exit(1);
  });
});

// console.log(process.argv);
// console.log(app.get('env'));
// console.log(process.env);
