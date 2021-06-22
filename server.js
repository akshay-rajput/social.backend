const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
var jwt = require("jsonwebtoken");

const { connectDB } = require("./db/db");

const requestLog = require("./middleware/requestLog");
const pageNotFound = require("./middleware/pageNotFound");
const errorHandler = require("./middleware/errorHandler");

const signupRouter = require("./router/signup");
const loginRouter = require("./router/login");
const postsRouter = require("./router/posts");
const followRouter = require("./router/follow");
// const playlistsRouter = require("./router/playlists");
const usersRouter = require("./router/users");
const searchRouter = require("./router/search");
const feedRouter = require("./router/feed");
const notificationRouter = require('./router/notification');
const port = 4000;

// to parse json from req.body
app.use(express.json());

app.use(cors());
// cors
let allowedOrigins = [
    "https://kvell.netlify.app",
    "http://localhost:3000",
    "http://192.168.43.156:3000",
];
app.use(function (req, res, next) {
    var origin = req.headers.origin;
    console.log('origin: ', origin)
    
    if(origin){
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            console.log("trying to access from other origin.");
            return res.status(400).json({ message: "Origin not allowed" });
        }
    }

    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

// log requests
app.use(requestLog);

// db connection call
connectDB();

// auth middleware
function authVerify(req, res, next) {
    let secret = process.env.SECRETKEY;

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        // console.log({ token })
        try {
            const decoded = jwt.verify(token, secret);
            req.user = { userID: decoded.userID };
            return next();
        } catch (error) {
            console.log(error);
            return res
                .status(401)
                .json({
                    message: "Unauthorised access, please add correct token",
                    error: error.message,
                });
        }
    } else {
        return res
            .status(401)
            .json({ message: "Token is required to make request" });
    }
}

// route handlers
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/posts', authVerify, postsRouter);
app.use('/follow', authVerify, followRouter);
app.use('/users', authVerify, usersRouter);
app.use('/search', authVerify, searchRouter);
app.use('/feed', authVerify, feedRouter);
app.use('/notification', authVerify, notificationRouter);

app.get("/", (req, res) => {
    res.send("API page for Kvell");
});

// this should be the last route so it catches any other route which isn't expected
app.use(pageNotFound);

// handle all errors here
app.use(errorHandler);

app.listen(process.env.PORT || port, () => {
    console.log(`Server started ==> listening on port ${port}!`);
});
