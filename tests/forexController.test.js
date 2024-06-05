import axios from 'axios';
import { fetchExchangeRates, convertCurrency } from '../src/controllers/forex.controller';
import { createError } from '../src/utils/error';
import isCurrencyCode from 'currency-code-validator';
import validator from 'validator';

jest.mock('axios');
jest.mock('currency-code-validator');
jest.mock('validator');

const API_KEY = process.env.API_ACCESS_KEY;
const API_RATES_URL = `https://open.er-api.com/v6/latest`;
const API_CONVERSION_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`

describe('Forex Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { query: {} };
        res = {
            json: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
    });


    describe('fetchExchangeRates', () => {
        it('should return exchange rates data on success', async () => {
            const data = { rates: { USD: 1.2, EUR: 1.1 } };
            axios.get.mockResolvedValue({ data });

            await fetchExchangeRates(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(API_RATES_URL);
            expect(res.json).toHaveBeenCalledWith(data);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error on failure', async () => {
            axios.get.mockRejectedValue(new Error('Network Error'));

            await fetchExchangeRates(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(API_RATES_URL);
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(createError(500, 'Failed to fetch exchange rates'));
        });
    });

    describe('convertCurrency', () => {
        it('should return converted currency data successfully', async () => {
            req.query = { from: 'USD', to: 'EUR', amount: '100' };
            isCurrencyCode.mockReturnValue(true);
            validator.isFloat.mockReturnValue(true);
            validator.isCurrency.mockReturnValue(true);

            const data = { result: 84 };
            axios.get.mockResolvedValue({ data });

            await convertCurrency(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(`https://v6.exchangerate-api.com/v6/undefined/pair/USD/EUR/100`);
            expect(res.json).toHaveBeenCalledWith(data);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error when missing query parameters', async () => {
            req.query = { from: 'USD', amount: '100' };

            await convertCurrency(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(`https://v6.exchangerate-api.com/v6/undefined/pair/USD/EUR/100`);
            expect(next).toHaveBeenCalledWith(createError(400, 'Missing query parameters'));
        });

        it('should call next with error when currency code is incorrect', async () => {
            req.query = { from: 'USD', to: 'abc', amount: '100' };
            isCurrencyCode.mockReturnValue(false);

            await convertCurrency(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(`https://v6.exchangerate-api.com/v6/undefined/pair/USD/abc/100`);
            expect(next).toHaveBeenCalledWith(createError(400, 'Incorrect currency code'));
        });

        it('should call next with error when amount is not a number', async () => {
            req.query = { from: 'USD', to: 'EUR', amount: 'abc' };
            isCurrencyCode.mockReturnValue(true);
            validator.isFloat.mockReturnValue(false);

            await convertCurrency(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(`https://v6.exchangerate-api.com/v6/undefined/pair/USD/EUR/abc`);
            expect(next).toHaveBeenCalledWith(createError(400, 'Incorrect currency amount'));
        });

        it('should call next with error when amount is negative number', async () => {
            req.query = { from: 'USD', to: 'EUR', amount: '-5' };
            isCurrencyCode.mockReturnValue(true);
            validator.isFloat.mockReturnValue(false);

            await convertCurrency(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(`https://v6.exchangerate-api.com/v6/undefined/pair/USD/EUR/-5`);
            expect(next).toHaveBeenCalledWith(createError(400, 'Incorrect currency amount'));
        });

        it('should call next with error when amount is floating number with more than two decimal places', async () => {
            req.query = { from: 'USD', to: 'EUR', amount: '1.234' };
            isCurrencyCode.mockReturnValue(true);
            validator.isFloat.mockReturnValue(false);

            await convertCurrency(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(`https://v6.exchangerate-api.com/v6/undefined/pair/USD/EUR/1.234`);
            expect(next).toHaveBeenCalledWith(createError(400, 'Incorrect currency amount'));
        });

        it('should call next with error on conversion failure', async () => {
            req.query = { from: 'USD', to: 'EUR', amount: '100' };
            isCurrencyCode.mockReturnValue(true);
            validator.isFloat.mockReturnValue(true);
            validator.isCurrency.mockReturnValue(true);

            axios.get.mockRejectedValue(new Error('Network Error'));

            await convertCurrency(req, res, next);

            expect(axios.get).toHaveBeenCalledWith(`https://v6.exchangerate-api.com/v6/undefined/pair/USD/EUR/100`);
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(createError(400, 'Failed to convert currency'));
        });
    });
});

