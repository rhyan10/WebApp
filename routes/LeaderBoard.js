var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var app = express();
var db = require('../db');
app.use(bodyparser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
router.get('/GrabScores', function(req, res, next) {
    var LeaderBoard = db.get().collection('LeaderBoard');
    LeaderBoard.find({}).toArray(function (err, result) {
        if (err) throw err;
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
});
router.get('/fetchScore',function(req,res,next){
    const username = req.query.Username;
    var LeaderBoard = db.get().collection('LeaderBoard');
    LeaderBoard.find({Name:username}).toArray(function (err,result) {
        var user = result[0];
        res.send(user);
    })
})
router.post('/AddPlayer', function(req, res, next) {
    const Username = req.body.Username;
    var LeaderBoard = db.get().collection('LeaderBoard');
    LeaderBoard.find({Name: Username}).toArray(function (err,result) {
        if (result.length === 0){
            var myobj = { Name: Username, Score: 0};
            LeaderBoard.insertOne(myobj, function(err, res) {});}
            else {}
            res.send('Post request successful');
        });
});
module.exports = router;