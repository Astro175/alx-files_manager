import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController'

const router = express.Router();

router.get('/status', AppController.getstatus); // Change to getstatus (all lowercase)

router.get('/stats', AppController.getstats); // Change to getstats (all lowercase)

router.post('/users', UsersController.postNew);

module.exports = router;
