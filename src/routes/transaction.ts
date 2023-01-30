import express from 'express'
import transaction from '../controllers/transaction'


const router = express.Router();


router.post('/sendTransaction', transaction.submitTransaction);


export default router