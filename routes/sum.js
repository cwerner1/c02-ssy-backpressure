const express = require('express');
const db = require('../src/database');
/*
const db = {
    database: db,
    sumCollection: sum
};
 */
const Request = require('request');
const config = require('../src/config');
const router = express.Router();


router.get('/:id', getItem);
router.get('/', getAll);

function getItem(req, res) {
    /* { id: ...., sum: .... } */
    let item = db.sumCollection.findOne({id: parseInt(req.params.id) });
    res.json(item);
}

function getAll(req, res) {
    res.json(db.sumCollection.find());
}

setTimeout(pollQueue, config.WORKER_TIMEOUT);

function pollQueue() {
    setTimeout(pollQueue, config.WORKER_TIMEOUT);
    Request.get({
        url: 'http://127.0.0.1:3000/queue',
        json: true
    }, queueResponse);

    function queueResponse(err, resp, body) {
        if (resp.statusCode === 204) {
            return;
        }

        /* body:
        {
            id: util.randomId(10),
            number: number
        }
         */

        let item = db.sumCollection.findOne({id: body.id});
        if (item === null) {
            /* DB: { id: ...., sum: .... } */
            db.sumCollection.insert({
                id: body.id,
                sum: body.number
            });
        } else {
            item.sum += body.number;
            db.sumCollection.update(item);
        }
    }
}


module.exports = router;
