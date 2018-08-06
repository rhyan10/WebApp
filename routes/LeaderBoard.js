var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var app = express();
const { poolPromise } = require('../db');
app.use(bodyparser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
router.get('/GrabScores', async (req, res, next) => {
    const pool = await poolPromise;
    const Username = req.query.Username;
    const results = await pool.request()
        .query("SELECT * FROM LeaderBoard");
    const result =  results['recordset'];
    var sortedArray = result.sort(function (a, b) {
        return (b.Score - a.Score);
    });
    var highscores = sortedArray.slice(0, 20);
    var finalarray = [];
    for (var i = 0; i < highscores.length; i++) {
        finalarray.push(highscores[i]['Name']);
        finalarray.push(highscores[i]['Score']);
    }
    var length = highscores.length;
    if (length < 20) {
        for (var i = 0; i < (20 - length); i++) {
            finalarray.push("-");
            finalarray.push("-");
        }
    }
    res.send(finalarray);
});
router.get('/fetchScore',async (req,res,next) =>{
    const username = req.query.Username;
    const pool = await poolPromise;
    const result = await pool.request()
        .query("SELECT * FROM LeaderBoard WHERE Name = '"+username+"'");
    res.send(result['recordset']);
})
router.post('/AddPlayer', async (req, res, next) => {
    const Username = req.body.Username;
    const pool = await poolPromise;
    const result = await pool.request()
        .query("SELECT TOP(1) * FROM LeaderBoard WHERE Name = '"+Username+"'");
        if(result['recordset'].length === 0){
            const result1 = await pool.request()
                .query("INSERT INTO LeaderBoard (Name,Score) VALUES ('"+Username+"',0)");
            res.send('Post request successful');
        }
});
module.exports = router;