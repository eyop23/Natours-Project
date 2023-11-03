const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
//order of middleware matters
app.use((req, res, next) => {
  console.log('hello middleware');
  next();
});
app.use((req, res, next) => {
  req.requetedTime = new Date().toISOString();
  next();
});
const port = 3000;
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
const GetAllTours = (req, res) => {
  console.log(req.requetedTime);
  res.status(200).json({
    status: 'ok',
    time: req.requetedTime,
    data: {
      tours
    }
  });
};
const GetTour = (req, res) => {
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
};
const UpdateTour = (req, res) => {
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
};
const DeleteTour = (req, res) => {
  const tour = tours.find(tours => tours.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'not found',
      message: 'invalid id'
    });
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: null
    }
  });
};
const PostTour = (req, res) => {
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
};
// app.get('/api/v1/tours', GetAllTours);
// app.post('/api/v1/tours', PostTour);
// app.get('/api/v1/tours/:id', GetTour);
// app.patch('/api/v1/tours/:id', UpdateTour);
// app.delete('/api/v1/tours/:id', DeleteTour);
app.route('/api/v1/tours').get(GetAllTours).post(PostTour);
app
  .route('/api/v1/tours/:id')
  .get(GetTour)
  .patch(UpdateTour)
  .delete(DeleteTour);

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
