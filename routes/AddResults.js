var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var {poolPromise} = require('../db');
var app = express();
app.use(bodyparser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
router.post('/', async (req, res, next) => {
    var id = req.body.Id;
    const Clone = parseInt(req.body.IsClone);
    var Username = req.body.username;
    const pool = await poolPromise;
    if(id.match(/[a-z]/i)){
        const _id = id;
        id = parseInt(Username);
        Username = _id;
        const result = await pool.request()
            .query("SELECT TOP(1) * FROM csvData WHERE ID = "+id+"");
        const results = result['recordset'][0];
        await pool.request().query("UPDATE LeaderBoard SET Score = Score + "+results['PointScore']+" WHERE Name = '"+Username+"'");
        if(results['Username1'] == ''){
            await pool.request().query("UPDATE csvData SET Username1 = '"+Username+"', IsClone1 = "+Clone+" WHERE ID = "+id+"");
            res.send('Post Successful')
        }
        else {
            if (results['Username2'] == '') {
                await pool.request().query("UPDATE csvData SET Username2 = '"+Username+"', IsClone2 = "+Clone+" WHERE ID = "+id+"");
                res.send('Post Successful')
            }
            else {
                if (results['Username3'] == '') {
                    await pool.request().query("UPDATE csvData SET Username3 = '"+Username+"', IsClone3 = "+Clone+" WHERE ID = "+id+"");
                    res.send('Post Successful')
                }
            }
        }

    }
    else {
        id = parseInt(id);
        const result = await pool.request()
            .query("SELECT TOP(1) * FROM csvData WHERE ID = " + id + "");
        const results = result['recordset'][0];
        await pool.request().query("UPDATE LeaderBoard SET Score = Score + "+results['PointScore']+" WHERE Name = '"+Username+"'");
        if (results['Username1'] == '') {
            await pool.request().query("UPDATE csvData SET Username1 = '"+Username+"', IsClone1 = "+Clone+" WHERE ID = "+id+"");
            res.send('Post Successful')
        }
        else {
            if (results['Username2'] == '') {
                await pool.request().query("UPDATE csvData SET Username2 = '"+Username+"', IsClone2 = "+Clone+" WHERE ID = "+id+"")
                res.send('Post Successful')
            }
            else {
                if (results['Username3'] == '') {
                    await pool.request().query("UPDATE csvData SET Username3 = '"+Username+"', IsClone3 = "+Clone+" WHERE ID = "+id+"")
                    res.send('Post Successful')
                }
            }
        }
    }
});
module.exports = router;
