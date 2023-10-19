import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.get('/status', AppController.getstatus); // Change to getstatus (all lowercase)

router.get('/stats', AppController.getstats); // Change to getstats (all lowercase)

router.post('/users', UsersController.postNew);

router.get('/connect', AuthController.getConnect);

router.get('/disconnect', AuthController.getDisconnect);

router.get('/users/me', UsersController.getMe);

module.exports = router;
