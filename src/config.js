module.exports = {
    MAX_QUEUE_LENGTH: 5,
    WORKER_TIMEOUT: 1000,
    CLIENT_TIMEOUT: 500,    // Client sendet schneller als Worker die Queue abfrägt --> Queue läuft voll
};
