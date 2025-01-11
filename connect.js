import mysql from "mysql";

// export const db_original = mysql.createConnection({
//     host:"bv2rebwf6zzsv341.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
//     user:"l6r7opakpr9pzdhb",
//     password:"vdig3ugs288l9zcd",
//     database:"l64hve0k6by5iu5h",
//     charset: "utf8mb4",
//     migrate: 'safe'
// });

// const memcachedConfig = "127.0.0.1:11211";
// export const db = new Memento({
//     mysql: db_original, 
//     memcached: memcachedConfig
// });

export const db = mysql.createConnection({
    host:"bv2rebwf6zzsv341.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user:"l6r7opakpr9pzdhb",
    password:"vdig3ugs288l9zcd",
    database:"l64hve0k6by5iu5h",
    charset: "utf8mb4",
    migrate: 'safe'
});

// export const db = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"lavozhispana2023",
//     database:"social",
//     charset: "utf8mb4"
// });