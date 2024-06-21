const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, getInventoryController, getDonorController, getTrustsController, getOrganisationController, getOrganisationforTrustController, getInventoryTrustController, analyticsController, getRecentTransactionController, allOrganisations, allDonors, allTrust } = require('../controllers/inventoryController');

const router = express.Router();

router.post('/create-inventory',authMiddleware, createInventoryController);
router.get('/get-inventory',authMiddleware, getInventoryController);
router.get('/get-recent-inventory',authMiddleware, getRecentTransactionController);
router.post('/get-inventory-trust',authMiddleware, getInventoryTrustController);
router.get('/get-donor',authMiddleware, getDonorController);
router.get('/get-charitabletrusts',authMiddleware,getTrustsController);
router.get('/get-organisation',authMiddleware,getOrganisationController);
router.get('/get-organisation-for-trust',authMiddleware,getOrganisationforTrustController);
router.get('/analytics-data',authMiddleware,analyticsController);
router.get('/get-all-organisations', authMiddleware,allOrganisations);
router.get('/get-all-donors', authMiddleware,allDonors);
router.get('/get-all-trusts', authMiddleware,allTrust);


module.exports = router;