// const tracer = require('dd-trace').init({
//   hostname: 'datadog-agent',
//   port: 8126
// })

require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const ATLAS_URI = process.env.MONGODB_URI
const bodyParser = require('body-parser')

const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require('./api/swagger.json')

const cookieParser = require("cookie-parser")
const session = require("express-session")
const MemoryStore = require("memorystore")(session)

const mongoDBConnection = require('./config/dbConn')
const PORT = process.env.PORT || 5001

// const router = express.Router()

// BEGIN MIDDLEWARE
// https://public-profile-backend-177cfb33de27.herokuapp.com
// https://portfolio-backend-pw8x.onrender.com

// link to live origin
// https://faizans-portfolio.onrender.com

app.use(express.json())
app.use(cors({
  origin: 'https://faizans-portfolio.onrender.com',
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}))

app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

app.use(cookieParser("secretcode"))
app.use(
  session({
    name: "__session",
    secret: "secretcode",
    store: new MemoryStore({
      checkPeriod: 60000 // prune expired entries every 24h 86400000
    }),
    resave: true,
    saveUninitialized: true,
    // cookie: {maxAge : 60000, secure: false, httpOnly: false }
  })
)

// END OF MIDDLEWARE

// Database
mongoDBConnection()

// Routes
const blogsRouter = require("./routes/blog_posts")
const postsRouter = require("./routes/posts")
const authRouter = require("./routes/auth")
const userRouter = require("./routes/users")

app.get("/", (req, res) => {
  res.send("You have landed on the API server")
})
app.use("/blogposts", blogsRouter)
app.use("/posts", postsRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// app.use('/api/v1', router)
app.use('/users', userRouter)
app.use('/auth', authRouter)

// Start server
mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully")
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
  // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})