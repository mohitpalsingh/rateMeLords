const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const assessmentRoutes = require('./routes/assessment');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/assessment', assessmentRoutes);

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
