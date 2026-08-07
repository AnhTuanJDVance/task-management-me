import "reflect-metadata";
import "dotenv/config";

import app from "./app";
import { AppDataSource } from "./database/data-source";


const PORT =
    process.env.PORT || 3000;


AppDataSource.initialize()
    .then(() => {

        console.log("DB connected");

        app.listen(PORT, () => {

            console.log(
                `Server running on port ${PORT}`
            );

        });

    })
    .catch((err) => {

        console.log(
            "DB error:",
            err
        );

    });