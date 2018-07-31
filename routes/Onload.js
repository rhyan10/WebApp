var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var url = "mongodb://localhost:27017/";
var MongoClient = require('mongodb').MongoClient;
var app = express();
var db = require('../db');
app.use(bodyparser());
app.use(bodyparser.urlencoded());
router.get('/fetchData', function(req, res, next) {
    var CsvData = db.get().collection('csvData');
    const Username = req.query.Username;
    CsvData.aggregate([{
        $project:{
            _id: 1,
            Location1: 1,
            Location2:1,
            pointscore:1,
            usernames:1,
            DocLength1:1,
            DocLength2:1,
            Similarity:1,
            Length:{$size:"$usernames"}
            }
            },{
        $match: {$and:[{"usernames.username": {$ne: Username}},{Length:{$lt:3}}]}}, {$sample: {size: 1}}]).toArray(function (err, result) {
            if(result[0] == null)
            {
                res.send("Finish");
            }
            else {
                res.send(result);
            }
        });
    });
router.get('/fetchdocument',function(req,res,next){
        var File = req.query.location;
        var FileReader = require('filereader');
        var FileAPI = require('file-api');
        var file = new FileAPI.File(File);
        const temporaryFileReader = new FileReader();
        temporaryFileReader.onload = function (evt) {
            res.send(evt.target.result);
        };
        temporaryFileReader.readAsText(file);

    })
module.exports = router;
// MongoClient.connect(url,function (err,db) {
//     const Username = req.query.Username;
    // const Username = 'BOBOOOB'
    // var dbo = db.db("DAL");
    // dbo.collection('csvData').aggregate([{
    //     $project:{
    //         _id: 1,
    //         Location1: 1,
    //         Location2:1,
    //         pointscore:1,
    //         usernames:1,
    //         DocLength1:1,
    //         DocLength2:1,
    //         Similarity:1,
    //         Length:{$size:"$usernames"}
    //
    //         }
    //     },
    //     {
    //         $match: {
    //             Length:{$lt:3}
    //         }
    //     },
    //     {
    //         $sample: {size: 1}
    //     }
    //     ]).toArray(function (err, result) {
    //     console.log(result);
    // })
// });