const express = require('express');
const sequelize = require('./config/db');
const models = require('./models/models');

const authRoutes = require('./routes/auth');
const collectionEditViewRoutes = require('./routes/collectionEditView');
const collectionsRoutes = require('./routes/collections');
const userRoutes = require('./routes/users');
const commentsRoutes = require('./routes/comments');
const tagsRoutes = require('./routes/tagsRoutes');

const salesforceRoutes = require('./routes/salesforce');
const odooRoutes = require('./routes/odooCollections');

const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.use(cors());
app.use(bodyParser.json()); //для обработки json в теле запросов
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/collectionEditView', collectionEditViewRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/tags', tagsRoutes);

app.use('/api/salesforce', salesforceRoutes);
app.use('/api/odooCollections', odooRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false })
  .then(() => {
    console.log('db connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('connect db error:', err);
  });
