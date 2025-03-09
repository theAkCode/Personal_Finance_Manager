import express from "express";
import {
  addTransactionController,
  getAllTransactionController,
  getSingleTransactionController,
  deleteTransactionController,
  deleteMultipleTransactionsController,
  updateTransactionController
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/addTransaction", addTransactionController);
router.post("/getTransaction", getAllTransactionController);
router.get("/getTransaction/:id", getSingleTransactionController); //  Get single transaction
router.post("/deleteTransaction/:id", deleteTransactionController);
router.post("/deleteTransactions", deleteMultipleTransactionsController); //  Delete multiple transactions
router.put("/updateTransaction/:id", updateTransactionController);

export default router;
