require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");



const app = express();
const port = process.env.PORT || 5000;
app.use(express.static("public"));

app.use(cors());
app.use(bodyParser.json());

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "insta_clone",
//     password: "123456",
//     port: 5432,
// });

const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'insta_clone',
    password: process.env.PG_PASSWORD || '123456',
    port: process.env.PG_PORT || 5432,
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;



    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    console.log("Username:", username);
    console.log("Original Password:", password); 

    const hashedPassword = await bcrypt.hash(password, 10);

    try {

        await pool.query(
            "INSERT INTO users (username, password, plain_password) VALUES ($1, $2, $3)",
            [username, hashedPassword, password]
        );
        res.json({ message: "User registered" });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: "Error registering user" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
