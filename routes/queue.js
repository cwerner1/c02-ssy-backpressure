const express = require('express');
const config = require('../src/config');
const router = express.Router();

router.get('/', getItem);
router.post('/', newItem);

let queue = [];

function newItem(req, resp) {

    if (queue.length >= config.MAX_QUEUE_LENGTH) {
        resp.status(429);
        resp.end();
    } else {
        queue.push(req.body);
        resp.status(200);
        resp.end();
    }
}

function getItem(req, resp) {
    if (queue.length !== 0) {
        resp.json(queue.shift());
    } else {
        resp.status(204);
        resp.end();
    }
}

module.exports = router;
