const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauce')

router.post('/', auth, multer, saucesCtrl.createSauce)
router.post('/:id/like', auth, saucesCtrl.likeSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, saucesCtrl.deleteSauce)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.get('/', auth, saucesCtrl.getAllSauces)

module.exports = router
