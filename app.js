const express = require('express');
const app =  express();
const pg = require('pg');
require('dotenv').config();

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
    next(); 
})
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

 app.get('/LastUpdateDetails', function (req, res) {
    pool.query("select modified from ff.feeder_data",(err,ress)=>
    {
        if(ress)
        {
            res.send((ress.rows[0].modified).toString());
            console.log((ress.rows[0].modified).toString());
        }else
        {
            res.send(err);
        }
        

    })
 })



 app.get('/feedFishTrue', function (req, res) {
    const bool = [true];
    pool.query("UPDATE ff.feeder_data SET should_feed = $1 , modified = now()",bool,(err,ress)=>
    {
        if(err)
        {
            res.send("Error: "+err);
            console.log(err);
        }else
        {
            res.send("Success: "+ress);
            console.log(ress);
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

 app.get('/feedFishFalse', function (req, res) {
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


 app.get('/feedFishFalseFrom8266', function (req, res) {
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

 app.listen( 3000,()=>{
    console.log("Server started at port 3000");
 })