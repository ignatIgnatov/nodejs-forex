import { createError } from "../utils/error.js";
import axios from "axios";
import isCurrencyCode from 'currency-code-validator';
import validator from "validator";

const API_KEY = process.env.API_ACCESS_KEY;
const API_RATES_URL = `https://open.er-api.com/v6/latest`;
const API_CONVERSION_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`

export const welcomeRoute = (req, res) => {
    res.send('Welcome to the Forex Application');
}

export const fetchExchangeRates = async (req, res, next) => {
    try {
        const apiResponse = await axios.get(API_RATES_URL);
        const result = apiResponse.data;
        res.json(result);
    } catch (error) {
        next(createError(500, 'Failed to fetch exchange rates'))
    }
}

export const convertCurrency = async (req, res, next) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        next(createError(400, 'Missing query parameters'))
    }

    if (!isCurrencyCode(from) || !isCurrencyCode(to)) {
        next(createError(400, 'Incorrect currency code'))
    }

    if (!validator.isFloat(amount) || amount < 0) {
        next(createError(400, 'Incorrect currency amount'))
    }

    try {
        const apiResponse = await axios.get(`${API_CONVERSION_URL}/${from}/${to}/${amount}`);

        const result = apiResponse.data;

        res.json(result);
    } catch (error) {
        next(createError(400, 'Failed to convert currency'))
    }
}

