const express = require('express');
const port=8000;
const app = express();
const path = require('path');

const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config()
app.use(express.json(),express.urlencoded({ extended: true }),
cors( {origin:'http://localhost:4200',credentials:true,methods:['POST','GET','DELETE','PUT']}) ,cookieParser());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

require("./config/mongo");
require("./routes/user-routes")(app);
require("./routes/training-routes")(app);
require("./routes/formateur-routes")(app);
require("./routes/evaluation-routes")(app);
require("./routes/video-routes")(app);




app.listen(port, () => {console.log(`listening to port ${port}`)});