import express from 'express';
import ClassesController from '../controllers/ClassesController';
import ClasssController from '../controllers/ConnectionsController';


const routes = express.Router();
const classesController = new ClassesController();
const ConnectionsController = new ClasssController();


//listando filtro
routes.get('/classes', classesController.index)
//criando
routes.post('/classes', classesController.create);

routes.get('/connections', ConnectionsController.index);
routes.post('/connections', ConnectionsController.create);



export default routes;
