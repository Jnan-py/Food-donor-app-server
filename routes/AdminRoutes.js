const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDonorsListController, getTrustsListController, getOrgListController, deleteDonor, deleteTrust, deleteOrg } = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/donor-list',authMiddleware,adminMiddleware,getDonorsListController);
router.get('/trust-list',authMiddleware,adminMiddleware,getTrustsListController);
router.get('/org-list',authMiddleware,adminMiddleware,getOrgListController);

router.delete('/delete-donor/:id',authMiddleware,deleteDonor);
router.delete('/delete-trust/:id',authMiddleware,deleteTrust);
router.delete('/delete-org/:id',authMiddleware,deleteOrg);


module.exports = router;