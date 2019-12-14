const express = require('express');
const db = require('../src/database');
const Request = require('request');
const config = require('../src/config');
const router = express.Router();


router.get('/:id', getItem);
router.get('/', getAll);

function getItem(req, res) {
    let item = db.sumCollection.findOne({id: parseInt(req.params.id)});
    res.json(item);
}

function getAll(req, res) {

    let items = db.sumCollection.find();
    res.json(items);
}

setTimeout(poolQueue, config.WORKER_TIMEOUT);

function poolQueue() {
    setTimeout(poolQueue, config.WORKER_TIMEOUT);
    Request.get({
        url: 'http://127.0.0.1:3000/queue',
        json: true,
    }, queueResponse);

    function queueResponse(err, resp, body) {
        if (resp.statusCode === 204) {
            return;
        }
        console.log(body);
        /**
         *  json: {
            id: util.randomId(10),
            number: number
        }
         */
        let item = db.sumCollection.findOne({id: body.id});

        if (item === null) {

            /* DB: {id: ...., sum: .. } */

            db.sumCollection.insert({
                id: parseInt(body.id),
                number: body.number,
            })
        } else {
            item.sum += body.number;
            db.sumCollection.update(item);
        }
    }

}

module.exports = router;
