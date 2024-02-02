const express = require('express')
const router = express.Router();

const userRoutes = require('./user')
const NotesRoutes = require('./notes')

router.use('/user',userRoutes)
router.use('/notes',NotesRoutes)


module.exports = router
