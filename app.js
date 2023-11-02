const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const port = 3000;
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
app.get('/api/v1/tours', (req, res) => {
  //   console.log(req.url);
  res.status(200).json({
    status: 'ok',
    data: {
      tours
    }
  });
});
app.get('/api/v1/tours/:id', (req, res) => {
  // console.log(+req.params.id);
  const tour = tours.find(tours => tours.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'not found',
      message: 'invalid id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
  // res.send('allright');
});
app.patch('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find(tours => tours.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'not found',
      message: 'invalid id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour'
    }
  });
});
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    err => {
      if (err) return;
      res.status(201).json({ status: 'created', data: { tour: newTour } });
    }
  );
});
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
