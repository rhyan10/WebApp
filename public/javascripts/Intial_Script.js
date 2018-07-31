var url = "mongodb://localhost:27017/";
function open_csv(){
    var FileReader = require('filereader');
    var FileAPI  = require('file-api');
    var file = new FileAPI.File('example_scala.csv');
    var reader = new FileReader();
    reader.onload = function(e) {
        var Text = reader.result;
        var lines = Text.split('\n');
        var result = [];
        console.log(lines)
        const h = 5;
        for(var i=0;i<lines.length;i++){
            var obj = new Object()
            var currentline=lines[i].split(",");
            //console.log(currentline);
            console.log(i);
            for(var j=0;j<h;j++){
                obj._id = i;
                switch (j){
                    case 0: obj.Location1 = currentline[j];
                        break;
                    case 1: var range = currentline[j];
                        var No = range.split('-');
                        const Length1 = parseInt(No[1])-parseInt(No[0])+1;
                        obj.DocLength1 = Length1;
                        break;
                    case 2: obj.Location2 = currentline[j];
                        break;
                    case 3: var range = currentline[j];
                        var No = range.split('-');
                        const Length2= parseInt(No[1])-parseInt(No[0])+1;
                        obj.DocLength2 = Length2;
                        break;
                    case 4:
                        var similar = currentline[j].split("\r");
                        obj.Similarity = similar[0];
                        break;

                }
                obj.pointscore = Math.round(((obj.DocLength1+obj.DocLength2 )*0.5)/(obj.Similarity)^2);
                obj.usernames = [];
            }
            result.push(obj);
        }
        var JSN = JSON.stringify(result);
        var Jsn = JSON.parse(JSN);
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(url,function (err,db) {
            var dbo = db.db("DAL");
            var k = [{Location: 0},{Location:1}];
            dbo.collection("csvData").insertMany(Jsn,function(error, inserted) {});
            db.close();
        })
    }
    reader.readAsText(file);
}
open_csv()