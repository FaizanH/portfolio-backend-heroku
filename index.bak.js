const tracer = require('dd-trace').init({
  hostname: 'datadog-agent-8p72',
  port: 8126
})

require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const path = require('path')

const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require('./api/swagger.json')

const cookieParser = require("cookie-parser")
const session = require("express-session")
const MemoryStore = require("memorystore")(session)

const mongoDBConnection = require('./config/dbConn')
const PORT = process.env.PORT || 8126
const { logEvents } = require('./middleware/logger.js')

// Crawlers detection
const crawlerUserAgents = [
  'facebookexternalhit', 'twitterbot', 'whatsapp', 'linkedinbot', 'telegrambot', 'slackbot', 'pinterest', 'discoursebot'
]

const isBot = (userAgent) => crawlerUserAgents.some(agent => userAgent.toLowerCase().includes(agent))

app.use(express.static(path.join(__dirname, 'build')));

// BEGIN MIDDLEWARE
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}))

app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

app.use(cookieParser("secretcode"))
app.set('trust proxy', '127.0.0.1')
app.use(
  session({
    name: "__session",
    secret: "secretcode",
    store: new MemoryStore({
      checkPeriod: 60000 // prune expired entries every 24h 86400000
    }),
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000, secure: false, httpOnly: false }
  })
)

// END OF MIDDLEWARE

// Database
mongoDBConnection()

// Handles every request
app.get('*', (req, res) => {
  const userAgent = req.headers['user-agent'];

  if (isBot(userAgent)) {
    const filePath = path.join(__dirname, 'build', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error loading the page');
      }

      // Modify data to include dynamic meta tags
      // const id = req.params.id || 'default'; // Get an ID from somewhere (params, query, etc.)
      const imageUrl = `TEST_PATH`;
      let result = data.replace('<meta property="og:image" content=""/>', `<meta name="og:image" content="${imageUrl}"/>`);

      res.send(result);
    });
  } else {
    // Normal users receive the standard SPA HTML
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  }
});

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
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/users', userRouter)
app.use('/auth', authRouter)

// Start server
mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully")
  logEvents('INFO', `Started MongoDB connection on port ${PORT}`, 'events.log')
  app.listen(PORT, () => console.log(`Started MongoDB connection on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvents('ERROR', `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
