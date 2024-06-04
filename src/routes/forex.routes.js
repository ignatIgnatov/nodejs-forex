import express from 'express';
import { convertCurrency, fetchExchangeRates, welcomeRoute } from '../controllers/forex.controller.js';

const router = express.Router();

router.get('/', welcomeRoute);
router.get('/rates', fetchExchangeRates);
router.get('/convert', convertCurrency);

export default router;