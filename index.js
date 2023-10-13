// Link to local url: http://localhost:5001/faizan-business-profile/us-central1/app

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ATLAS_URI = process.env.MONGODB_URI;
const bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./api/swagger.json');

// const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = new express();
const router = express.Router();

// https://www.faizan.com.au for production
// https://localhost:5001/faizan-business-profile/us-central1/app

// BEGIN MIDDLEWARE
// https://public-profile-backend-177cfb33de27.herokuapp.com
// https://faizanh.github.io/portfolio/
app.use(express.json());
app.use(cors({
  origin: 'https://portfolio-app-0dj3.onrender.com',
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}))

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cookieParser("secretcode"));
app.use(
  session({
    name: "__session",
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    // cookie: {maxAge : 60000, secure: false, httpOnly: false }
  })
);
// app.use(passport.initialize());
// app.use(passport.session());
// require("./services/passport/config")(passport);

// END OF MIDDLEWARE

// Add error handling
mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

// Database
const blogsRouter = require("./routes/blog_posts");
const postsRouter = require("./routes/posts");
// const authRouter = require("./routes/auth");

// Add Routes here
/*
const exampleRouter = require("./routes/example");
app.use("/example", exampleRouter);
*/
app.get("/", (req, res) => {
  res.send("You have landed on the API server");
});

app.use("/blogposts", blogsRouter);
app.use("/posts", postsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);
// app.use('/auth', authRouter);

app.listen(process.env.PORT || 5001, () => {
  console.log("Successfully retrieved backend data")
})