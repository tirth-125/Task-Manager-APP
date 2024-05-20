// const express = require("express");
// const cors = require('cors');
// const taskrouter = require("./starter/router/taskrouters");
// const AuthRouter = require("./starter/router/authRouter");
// const app = express();

// app.use(cors());
// app.use(cors({
//     origin: 'http://127.0.0.1:500',
//     methods: ['GET', 'POST'], // Specify the HTTP methods allowed
//   }));
// app.use(express.static('./public'))
// const errorMiddleware = require("./starter/middleware/error");
// app.use(express.json());

// app.use('/api/v1/auth', AuthRouter);
// app.use('/api/v1/task',taskrouter);

// app.use(errorMiddleware);

// module.exports = app;
const express = require("express");
const cors = require('cors');
const taskrouter = require("./starter/router/taskrouters");
const AuthRouter = require("./starter/router/authRouter");
const app = express();

app.use(cors());


// app.use(express.static('./public'));
const errorMiddleware = require("./starter/middleware/error");
app.use(express.json());

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/task', taskrouter);



app.use(errorMiddleware);



module.exports = app;
