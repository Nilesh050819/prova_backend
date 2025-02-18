const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router
    .route("/watchlist")
    .get(dashboardController.getWatchlist);

router.route("/watchlistKeywordView")
    .get(dashboardController.getWatchlistKeywordView);

router.route("/product")
    .get(dashboardController.getProducts)
    .put(dashboardController.updateProduct);

router.route("/keyword")
    .put(dashboardController.updateKeyword);

router.route("/searchKeywords")
    .get(dashboardController.getSearchKeywords);

router.route("/searchProducts")
    .get(dashboardController.getSearchProducts);

router.route("/updateProductKeywordConfig")
    .put(dashboardController.updateProductKeywordConfig);

router.route("/checkProductKeywordConfig")
    .post(dashboardController.checkProductKeywordConfig);
module.exports = router;  