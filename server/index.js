const express = require("express");
const morgan = require("morgan");
const pg = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express()

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({extended:true}));

const db = new pg.Client({
    host:"localhost",
    port:5432,
    database:"finance_tracker",
    user:"postgres",
    password:"root"
});

db.connect().then(()=>{
    console.log("Database connected!")
})

app.get("/",(req,res)=>{
    res.send("Hello world!");
})

app.post("/add",async(req,res)=>{
    const data = req.body;
    await db.query("INSERT INTO HISTORY(DESCRIPTION, MODE, AMOUNT) VALUES($1,$2,$3)",
        [data.description, data.mode, data.amount]);
    res.status(201).send("Record inserted");
})

app.get("/transactions",async(req,res)=>{
    const result = await db.query(
        "SELECT * FROM history"
    );
    res.send(result.rows);
})

app.listen(3001, ()=>{
    console.log("Server started at PORT 3001");
})