var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var db = require('../db');
var app = express();
app.use(bodyparser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
router.post('/', function(req, res, next) {
    var id = req.body.Id;
    const Clone = parseInt(req.body.IsClone);
    var Username = req.body.username;
    var CsvData = db.get().collection('csvData');
    var LeaderBoard = db.get().collection('LeaderBoard');
    if(id.match(/[a-z]/i)){
        Username = parseInt(Username);
        CsvData.update({_id:Username },{$push:{usernames:{username:id,IsClone:Clone}}});
        CsvData.find({_id:Username}).toArray(function (err,result) {
            const points = result[0]['pointscore'];
            LeaderBoard.update(
                { Name: id },
                { $inc: { Score: points} } );
            res.send('Post request successful');
        });
    }
    else {
        id = parseInt(id);
        CsvData.update({_id: id}, {$push: {usernames: {username: Username, IsClone: Clone}}});
        CsvData.find({_id: id}).toArray(function (err, result) {
            const points = result[0]['pointscore'];
            LeaderBoard.update(
                {Name: Username},
                {$inc: {Score: points}});
            res.send('Post request successful');
        });
    }
});
module.exports = router;
