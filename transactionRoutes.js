const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/getalltransaction', transactionController.getAllTransactions); 
router.post('/serchtransaction', transactionController.searchTransactions); 

module.exports = router;
                