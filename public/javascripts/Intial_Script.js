var sql = require('mssql');
const config = {
    server: 'localhost',
    port: '4001',
    database: 'DAT',
    user: 'Rhyan1',
    password: 'jack'
};
//const pool = new sql.Connection(config);
function open_csv() {
    var FileReader = require('filereader');
    var FileAPI = require('file-api');
    var file = new FileAPI.File('example_scala.csv');
    var reader = new FileReader();
    var result = [];
    reader.onload = function (e) {
        var Text = reader.result;
        var lines = Text.split('\r\n');
            var j = 1;
        const pool1 = new sql.ConnectionPool(config, err => {
            for (var i = 0; i < lines.length; i++) {
                var currentline = lines[i].split(",");
                const length1 = currentline[1].split('-');
                const Doclength1 = length1[1] - length1[0] + 1;
                const length2 = currentline[3].split('-');
                const Doclength2 = length2[1] - length2[0] + 1;
                const similarity = parseFloat(currentline[4]);
                const Pointscore = Math.round((0.5 * (Doclength1 + Doclength2)) / similarity);
                const row = [currentline[0], currentline[2], Doclength1, Doclength2, similarity, Pointscore];
                pool1.request()
                    .query("INSERT INTO csvData (Location1,Location2,DocLength1,DocLength2,Similarity,PointScore,Username1,IsClone1,Username2,IsClone2,Username3,IsClone3) VALUES('"+currentline[0]+"','"+currentline[2]+"',"+Doclength1+","+Doclength2+","+similarity+","+Pointscore+",'',2,'',2,'',2)", (err, result) => {
                        // ... error checks
                        console.dir(result)
                        if(lines.length == j){
                            pool1.close();
                        }
                        j++
                    })
            }
        })
    }
        reader.readAsText(file);
}
function Create_Database() {
    sql.connect(config, function (err) {
        var request = new sql.Request();
        var ssql = "CREATE TABLE csvData (ID Integer PRIMARY KEY IDENTITY(1, 1), Location1 VARCHAR(MAX),Location2 VARCHAR(MAX),DocLength1 INT, DocLength2 INT, Similarity FLOAT, PointScore INT, Username1 VARCHAR(50), IsClone1 INT, Username2 VARCHAR(50), IsClone2 INT, Username3 VARCHAR(50), IsClone3 INT) CREATE TABLE LeaderBoard (ID Integer PRIMARY KEY IDENTITY(1, 1), Name VARCHAR(50), Score INT) CREATE TABLE CloneData (ID Integer PRIMARY KEY IDENTITY(1, 1),Location1 VARCHAR(MAX), Location2 VARCHAR(MAX), IsClone INT)";
        request.query(ssql, function (err, result) {
            if (err) throw err;
            console.log("Tables created");
            sql.close();
        });
    })
}
open_csv();
Create_Database();