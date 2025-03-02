import express from 'express';
import { 
    addTransactionController, 
    deleteTransactionController, 
    getAllTransactionController, 
    updateTransactionController, 
    getSingleTransactionController,  // New route
    deleteMultipleTransactionsController // New route
} from '../controllers/transactionController.js';

const router = express.Router();

// Existing routes
router.route("/addTransaction").post(addTransactionController);
router.route("/getTransaction").post(getAllTransactionController);
router.route("/deleteTransaction/:id").post(deleteTransactionController);
router.route("/updateTransaction/:id").put(updateTransactionController);

// New routes
router.route("/getTransaction/:id").get(getSingleTransactionController);  // Fetch single transaction
router.route("/deleteTransactions").post(deleteMultipleTransactionsController);  // Delete multiple transactions

export default router;
