const express = require('express');
const app =  express();
const pg = require('pg');
require('dotenv').config();


const pool = new pg.Pool({
    user:process.env.USER,
    host:process.env.HOST,
    database:process.env.DB,
    password: process.env.PASS,
    // ssl:{
    //     rejectUnauthorized:true
    // },
    sslmode:false
  });
pool.connect();



app.get('/', function (req, res) {
    pool.query("select * from ff.feeder_data",(err,res)=>
    {
        console.log(res.rows);

    })
    res.send('Hello World');
 })


 app.post('/feedFishTrue', function (req, res) {
    const bool = [true];
    pool.query("UPDATE ff.feeder_data SET should_feed = $1 , modified = now()",bool,(err,res)=>
    {
        if(err)
        {
            console.log(err);
        }else
        {
            console.log(res);
        }
    })
 })


 app.get('/currentValue', async function (req, res) {
    var  finalData ;
    await pool.query("select should_feed from ff.feeder_data",(err,ress)=>
    {
        if(err)
        {
             console.log(err);
             finalData=err;
        }else
        {
            console.log(ress.rows[0].should_feed);
            var value = (ress.rows[0].should_feed).toString();
            res.send((ress.rows[0].should_feed).toString()) ;
            if(value==="true")
            {
                makeFalse();
            }
        }
    })
 })

function makeFalse()
{
    const bool = [false];
    pool.query("UPDATE ff.feeder_data SET should_feed = $1 , modified = now()",bool,(err,ress)=>
    {
        if(err)
        {
            console.log("Make False failed");
        }else
        {
            console.log("Make False complete");
        }
    })
}

 app.post('/feedFishFalse', function (req, res) {
    const bool = [false];
    pool.query("UPDATE ff.feeder_data SET should_feed = $1 , modified = now()",bool,(err,ress)=>
    {
        if(err)
        {
            console.log(err);
            res.send("-1");
        }else
        {
            console.log(ress);
            res.send("1");
        }
    })
 })


 app.post('/feedFishFalseFrom8266', function (req, res) {
    const bool = [false];
    pool.query("UPDATE ff.feeder_data SET should_feed = $1 , modified = now()",bool,(err,ress)=>
    {
        if(err)
        {
            console.log(err);
            res.send("-1");
        }else
        {
            console.log(ress);
            res.send("1");
        }
    })
 })

 app.listen(process.env.port|| 3000,()=>{
    console.log("Server started at port 3000");
 })