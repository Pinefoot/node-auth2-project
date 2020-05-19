require("dotenv").config();

const server = require("./api/server.js");

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** THE SERVER IS COMING FROM INSIDE THE ${port} **\n`));
