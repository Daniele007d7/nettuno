When trying to clone this project, create a new folder in /public called "images"
You should run the sql code to create 2 tables used for the DB.

Then you can replace
const host_name
const user_name
const db_name
const db_pass

with the data of your DB and remove:

import "dotenv/config";

const host_name = process.env.HOST_NAME;
const user_name = process.env.USER_NAME;
const db_name = process.env.DB_NAME;
const db_pass = process.env.DB_PASSWORD;
