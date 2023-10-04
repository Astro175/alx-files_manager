import express from 'express';
import AppController from '../controller/AppController';

const router = express.Router();

router.get('/status', AppController.getstatus); // Change to getstatus (all lowercase)

router.get('/stats', AppController.getstats); // Change to getstats (all lowercase)

module.exports = router;
