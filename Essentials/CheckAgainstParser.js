var url = "mongodb://localhost:27017/";
var MongoClient = require('mongodb').MongoClient;
var FileReader = require('filereader');
var FileAPI  = require('file-api');
var file = new FileAPI.File('example_scala.csv');
var reader = new FileReader();
var j = 0;
var n = 0;
function Add_new_Documents(fn) {
    MongoClient.connect(url, function (err, db) {
        var dbo = db.db("DAL");
        dbo.collection('csvData').aggregate([{$group: {_id: '', last: {$max: "$_id"}}}]).toArray(function (err,maxlength) {
            var columns = ["L1","D1","L2","D2","Sim"];
            require("csv-to-array")({
                file: "./public/javascripts/example_scala.csv",
                columns: columns
            }, function (err, array) {
                for (var i = 0; i < array.length; i++) {
                    const line = array[i];
                    const location1 = line['L1'];
                    var range1 = line['D1'];
                    var No1 = range1.split('-');
                    const Length1 = parseInt(No1[1]) - parseInt(No1[0]) + 1;
                    const location2 = line['L2'];
                    var range2 = line['D2'];
                    var No2 = range2.split('-');
                    const Length2 = parseInt(No2[1]) - parseInt(No2[0]) + 1;
                    const similarity = line['Sim'];
                    dbo.collection('csvData').find({$and: [{Location1: location1}, {Location2: location2}]}).toArray(function (err, result) {
                        j++;
                        if (result[0] == null) {
                            n++;
                            const PointScore = Math.round(((Length1 + Length2) * 0.5) / (similarity) ^ 2);
                            var obj = new Object();
                            var length = maxlength[0]['last'];
                            obj._id = length + n;
                            obj.Location1 = location1;
                            obj.pointscore = PointScore;
                            obj.usernames = [];
                            obj.DocLength1 = Length1;
                            obj.Location2 = location2;
                            obj.DocLength2 = Length2;
                            obj.Similarity = (similarity.split('\r')[0]);
                            dbo.collection("csvData").insertOne(obj);
                            fn(array.length, obj._id, obj.Location1, obj.Location2);
                            if (j == (array.length)) {
                                db.close();
                            }
                        }
                        else {
                            fn(array.length, result[0]['_id'], result[0]['Location1'], result[0]['Location2']);
                            if (j == (array.length)) {
                                db.close();
                            }
                        }
                        ;
                    })
                }
            })
        });
    });
}
var ids = [];
var Location1s = [];
var Location2s = [];
Add_new_Documents(function(length,id,l1,l2){
    ids.push(id);
    Location1s.push(l1);
    Location2s.push(l2);
    if(ids.length  == length){
        MongoClient.connect(url, function (err, db) {
            var dbo = db.db("DAL");
            dbo.collection('csvData').remove({_id:{$nin:ids}});
            var CloneDataIds = [];
            var o = 0;
            for(var k = 0;k<ids.length;k++){
                const location1 = Location1s[k];
                const location2 = Location2s[k];
                dbo.collection('CloneData').find({$and:[{Location1:location1},{Location2:location2}]}).toArray(function(err,result){
                    o++;
                    if(result[0] == null){
                        if(o == (ids.length)){
                            dbo.collection('CloneData').remove({_id:{$nin:CloneDataIds}});
                            db.close()
                        }
                    }
                    else{
                        CloneDataIds.push(result[0]['_id']);
                        if(o == (ids.length)){
                            dbo.collection('CloneData').remove({_id:{$nin:CloneDataIds}});
                            db.close()
                        }
                    }
                })
            }
        });
    }
});