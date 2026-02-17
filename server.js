import express from "express";
import config from "./config/config.js";
import router from "./src/routes/index.js";
const app = express();

app.use("/api", router);


app.listen(config.PORT, () => {
    console.log(`App listening on ${config.PORT}`);
})



