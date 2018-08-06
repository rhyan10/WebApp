const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const app = express();
const { poolPromise } = require('../db');
app.use(bodyparser());
app.use(bodyparser.urlencoded());
router.get('/fetchData', async (req, res, next) => {
    const pool = await poolPromise;
    const Username = req.query.Username;
    const result = await pool.request()
        .query("SELECT TOP(1) * from csvData WHERE Username1 != '" + Username + "' AND Username2 != '" + Username + "' AND Username3 = ''",);
    res.send(result['recordset']);
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