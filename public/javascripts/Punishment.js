var url = "mongodb://localhost:27017/";
var MongoClient = require('mongodb').MongoClient
MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
    var dbo = db.db('DAL');
    var CloneData = dbo.collection('CloneData');
    var CsvData = dbo.collection('csvData');
    var LeaderBoard = dbo.collection('LeaderBoard');
    CsvData.find({}).toArray(function (err,result) {
        var j = 0;
        for (var i = 0; i < result.length; i++) {
            j++;
            const points = result[i]['pointscore'];
            const usernames = (result[i]['usernames']);
            const length = usernames.length;
            const Address1 = result[i]['Location1'];
            const Address2 = result[i]['Location2'];
            const punishment = -(points + 20);
            CloneData.find({$and: [{Location1: Address1}, {Location2: Address2}]}).toArray(function (err, result2) {
                if (length > 2 && result2[0] == null) {
                    console.log('hi')
                    const Cloneresults = [usernames[0]['IsClone'], usernames[1]['IsClone'], usernames[2]['IsClone']]
                    const add = (a, b) => a + b;
                    const sum = Cloneresults.reduce(add)
                    if (sum == 0) {
                        var myobj = {Location1: Address1, Location2: Address2, Is_Clone: 0};
                        CloneData.insertOne(myobj);
                    }
                    if (sum == 3) {
                        var myobj = {Location1: Address1, Location2: Address2, Is_Clone: 1};
                        CloneData.insertOne(myobj);
                    }
                    if (sum == 2) {
                        var myobj = {Location1: Address1, Location2: Address2, Is_Clone: 1};
                        CloneData.insertOne(myobj);
                        var odd = Cloneresults.indexOf(0);
                        LeaderBoard.update(
                            {Name: usernames[odd]['username']},
                            {$inc: {Score: punishment}});
                    }
                    if (sum == 1) {
                        var myobj = {Location1: Address1, Location2: Address2, Is_Clone: 0};
                        CloneData.insertOne(myobj);
                        var odd = Cloneresults.indexOf(1);
                        LeaderBoard.update(
                            {Name: usernames[odd]['username']},
                            {$inc: {Score: punishment}});
                    }
                }
            })
            if(j == result.length){
                db.close();
            }
        }
    })
});
