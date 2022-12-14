const express = require('express');
const { loginHandler, autorizationHandler, sameIdHanlder } = require('../../middlewares/auth');
const validatorHandler = require('../../middlewares/validator');
const {createCustomerSchema, updateCustomerSchema, getCustomerSchema, loginCustomerSchema} = require('./schema');
const CustomerService = require('./service');
const customerRouter = express.Router();
const service = new CustomerService;

customerRouter.get('/',
    async (req, res, next) => {
        try{
            const customers = await service.find();
            res.json(customers)
        }catch(error){
            next(error)
        }
    }
);

customerRouter.get('/:id',
    validatorHandler(getCustomerSchema, 'params'),
    autorizationHandler('customer'),
    sameIdHanlder,
    async (req, res, next) => {
        try{
            const { id } = req.params;
            const customer = await service.findOne(id)
            res.json(customer)
        }catch(error){
            next(error)
        }
    }
);

customerRouter.post('/',
    validatorHandler(createCustomerSchema, 'body'),
    async (req, res, next) => {
        try{
            const body = req.body;
            const customer = await service.create(body);
            res.status(201).json(customer)
        }catch(error){
            next(error)
        }
    }
);

customerRouter.post('/login',
    validatorHandler(loginCustomerSchema, 'body'),
    loginHandler(service.findOneByEmail, 'customer'),
);

customerRouter.patch('/:id', 
    validatorHandler(getCustomerSchema, 'params'),
    autorizationHandler('customer'),
    sameIdHanlder,
    validatorHandler(updateCustomerSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const customer = await service.update(id, body)
            res.status(201).json({
                messaje: `Customer with id: ${id} modified`,
                customer
            })
        } catch (error) {
            next(error)
        }
    }
)

customerRouter.delete('/:id', 
    validatorHandler(getCustomerSchema, 'params'),
    autorizationHandler('customer'),
    sameIdHanlder,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id)
            res.status(200).json({
                messaje: `Customer with id: ${id} deleted`,
            })
        } catch (error) {
            next(error)
        }
    }
)

module.exports = {customerRouter}