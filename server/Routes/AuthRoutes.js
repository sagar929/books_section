const express = require('express');
const { register, login } = require('../controllers/Controllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// router.get('/me', auth, getMe);

module.exports = router;