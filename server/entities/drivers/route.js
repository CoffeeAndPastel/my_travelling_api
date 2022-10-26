const express = require('express');
const validatorHandler = require('../../middlewares/validator');
const {createDriverSchema, updateDriverSchema, getDriverSchema} = require('./schema');
const DriverService = require('./service');
const driverRouter = express.Router();
const service = new DriverService;

driverRouter.get('/',
    async (req, res, next) => {
        try{
            const drivers = await service.find();
            res.json(drivers)
        }catch(error){
            next(error)
        }
    }
);

driverRouter.get('/:id',
    validatorHandler(getDriverSchema, 'params'),
    async (req, res, next) => {
        try{
            const { id } = req.params;
            const driver = await service.findOne(id)
            res.json(driver)
        }catch(error){
            next(error)
        }
    }
);

driverRouter.post('/',
    validatorHandler(createDriverSchema, 'body'),
    async (req, res, next) => {
        try{
            const body = req.body;
            const driver = await service.create(body);
            res.status(201).json(driver)
        }catch(error){
            next(error)
        }
    }
);

driverRouter.patch('/:id', 
    validatorHandler(getDriverSchema, 'params'),
    validatorHandler(updateDriverSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const driver = await service.update(id, body)
            res.status(201).json({
                messaje: `Driver with id: ${id} modify`,
                driver
            })
        } catch (error) {
            next(error)
        }
    }
)

driverRouter.delete('/:id', 
    validatorHandler(getDriverSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id)
            res.status(200).json({
                messaje: `Driver with id: ${id} deleted`,
            })
        } catch (error) {
            next(error)
        }
    }
)

module.exports = {driverRouter}