const AppError = require("../../errorHandling/AppError");
const sql = require("../models/db");
exports.getWatchlist = async (req, res, next) => {
    const { page, limit, searchType, search, p_infytrix_brand_id, platform, favoriteOnly } = req.query;

    let dbQuery = "SELECT * FROM fn_get_watchlist_product_view( p_infytrix_brand_id := $1, p_page := $2, p_limit := $3,p_platform:=$4,p_favorite_only:=$5)";
    let dbQueryValues = [p_infytrix_brand_id, page, limit, platform, favoriteOnly];

    if (searchType == "p_product_search") {
        dbQuery = "SELECT * FROM fn_get_watchlist_product_view( p_infytrix_brand_id := $1,p_product_search := $2 ,p_page := $3, p_limit := $4,p_platform:=$5,p_favorite_only:=$6)";
        dbQueryValues = [p_infytrix_brand_id, search, page, limit, platform, favoriteOnly];
    } else if (searchType == "p_keyword_search") {
        dbQuery = "SELECT * FROM fn_get_watchlist_product_view( p_infytrix_brand_id := $1,p_keyword_search := $2 ,p_page := $3, p_limit := $4,p_platform:=$5,p_favorite_only:=$6)";
        dbQueryValues = [p_infytrix_brand_id, search, page, limit, platform, favoriteOnly];
    }



    //sql.query("SELECT * FROM neo_users where user_name = $1", [email], (err, result) => {
    sql.query(dbQuery, dbQueryValues, (err, result) => {
        if (err) {
            return next(new AppError(400, "Unable to get data."))
        }
        if (result['rows']) {
            res.status(200).json({
                status: "success",
                data: result['rows']
            });
        }
    });
}

exports.getWatchlistKeywordView = async (req, res, next) => {
    const { page = 0, limit = 10, p_infytrix_brand_id } = req.query;
    let dbQuery = "SELECT * FROM fn_get_watchlist_keyword_view( p_infytrix_brand_id := $1, p_page := $2, p_limit := $3)";
    let dbQueryValues = [p_infytrix_brand_id, page, limit];

    sql.query(dbQuery, dbQueryValues, (err, result) => {
        if (err) {
            return next(new AppError(400, "Unable to get data."))
        }
        if (result['rows']) {
            res.status(200).json({
                status: "success",
                data: result['rows']
            });
        }
    });
}

exports.getProducts = async (req, res, next) => {
    const { p_infytrix_brand_id, p_platform = "Amazon", p_product_search, page, limit } = req.query;

    let dbQuery = "SELECT * FROM fn_get_product( p_infytrix_brand_id := $1,p_platform:=$2,p_page:=$3,p_limit:=$4)";
    let dbQueryValues = [p_infytrix_brand_id, p_platform, page, limit];
    if (p_product_search) {
        dbQuery = "SELECT * FROM fn_get_product( p_infytrix_brand_id := $1,p_platform:=$2,p_product_search:=$3,p_page:=$4,p_limit:=$5)";
        dbQueryValues = [p_infytrix_brand_id, p_platform, p_product_search, page, limit];
    }

    sql.query(dbQuery, dbQueryValues, (err, result) => {
        if (err) {
            return next(new AppError(400, "Unable to get data."));
        }
        if (result['rows']) {
            res.status(200).json({
                status: "success",
                data: result['rows']
            });
        }
    });
}


exports.updateProduct = async (req, res, next) => {
    const {
        p_infytrix_brand_id,
        p_platform,
        p_product,
        p_favorite_flag,
        p_initial_favorite_priority_rank,
        p_final_favorite_priority_rank,
    } = req.body;
    console.log(req.body);
    let dbQuery = "SELECT * FROM fn_update_watchlist_product_favorite_priority_rank( p_infytrix_brand_id := $1,p_platform:=$2,p_product:=$3,p_favorite_flag:=$4,p_initial_favorite_priority_rank:=$5,p_final_favorite_priority_rank:=$6)";
    let dbQueryValues = [
        p_infytrix_brand_id,
        p_platform,
        p_product,
        p_favorite_flag,
        p_initial_favorite_priority_rank,
        p_final_favorite_priority_rank
    ];
    sql.query(dbQuery, dbQueryValues, (error, result) => {
        if (error) {
            console.log(error);
            return next(new AppError(400, "Unable to update data."));
        }
        if (result['rows'][0]?.fn_update_watchlist_product_favorite_priority_rank >= 0) {
            res.status(200).json({
                status: "success",
            });
        } else {
            console.log(result['rows'][0])
            return next(new AppError(400, "Unable to update data."));
        }
    });
}



exports.getSearchKeywords = async (req, res, next) => {
    const {
        p_infytrix_brand_id,
        p_keyword_search
    } = req.query;
    let dbQuery = "SELECT * FROM fn_get_keyword(p_infytrix_brand_id := $1,p_keyword_search:=$2)";
    let dbQueryValues = [
        p_infytrix_brand_id,
        p_keyword_search
    ];
    sql.query(dbQuery, dbQueryValues, (error, result) => {
        if (error) {
            console.log(error);
            return next(new AppError(400, "Unable to get data."));
        }
        if (result['rows']) {
            res.status(200).json({
                status: "success",
                data: result['rows']
            });
        } else {
            return next(new AppError(400, "Unable to get data."));
        }
    });
}

exports.getSearchProducts = async (req, res, next) => {
    const { p_infytrix_brand_id, p_product_search, p_product_distinct_search = true } = req.query;

    let dbQuery = "SELECT * FROM fn_get_product( p_infytrix_brand_id := $1,p_product_search:=$2,p_product_distinct_search:=$3)";
    let dbQueryValues = [p_infytrix_brand_id, p_product_search, p_product_distinct_search];


    sql.query(dbQuery, dbQueryValues, (err, result) => {
        if (err) {
            return next(new AppError(400, "Unable to get data."));
        }
        if (result['rows']) {
            res.status(200).json({
                status: "success",
                data: result['rows']
            });
        }
    });
}





exports.updateKeyword = async (req, res, next) => {
    const {
        p_infytrix_brand_id,
        p_platform,
        p_product,
        p_keyword,
        p_favorite_flag,
        p_initial_favorite_priority_rank,
        p_final_favorite_priority_rank,
    } = req.body;
    let dbQuery = "SELECT * FROM fn_update_watchlist_keyword_favorite_priority_rank( p_infytrix_brand_id:= $1,p_platform:=$2,p_product:=$3,p_keyword:=$4,p_favorite_flag:=$5,p_initial_favorite_priority_rank:=$6,p_final_favorite_priority_rank:=$7)";
    let dbQueryValues = [
        p_infytrix_brand_id,
        p_platform,
        p_product,
        p_keyword,
        p_favorite_flag,
        p_initial_favorite_priority_rank,
        p_final_favorite_priority_rank
    ];
    sql.query(dbQuery, dbQueryValues, (error, result) => {
        if (error) {
            return next(new AppError(400, "Unable to update data."));
        }
        if (result['rows'][0]?.fn_update_watchlist_keyword_favorite_priority_rank >= 0) {
            res.status(200).json({
                status: "success"

            });
        } else {
            return next(new AppError(400, "Unable to update data."));
        }
    });
}









exports.updateProductKeywordConfig = async (req, res, next) => {
    let {
        p_infytrix_brand_id,
        data
    } = req.body;
    console.log(req.body);
    //data = data.map((e) => JSON.stringify(e));
    let dbQuery = "SELECT * FROM fn_update_watchlist_product_keyword_config(p_infytrix_brand_id:=$1,product_keyword_config_list:=$2)";
    let dbQueryValues = [
        p_infytrix_brand_id,
        data
    ];
    sql.query(dbQuery, dbQueryValues, (error, result) => {
        if (error) {
            console.log(error);
            return next(new AppError(400, "Unable to update data."));
        }
        console.log(result['rows'][0]);
        if (result['rows'][0]?.fn_update_watchlist_product_keyword_config === null) {
            res.status(200).json({
                status: "success",
            });
        } else {
            return next(new AppError(400, "Unable to update data."));
        }
    });
}



exports.checkProductKeywordConfig = async (req, res, next) => {
    let {
        p_infytrix_brand_id,
        data
    } = req.body;
    let dbQuery = "SELECT * FROM fn_check_watchlist_product_keyword_config(p_infytrix_brand_id:=$1,product_keyword_config_list:=$2)";
    let dbQueryValues = [
        p_infytrix_brand_id,
        data
    ];
    sql.query(dbQuery, dbQueryValues, (error, result) => {
        if (error) {
            console.log(error);
            return next(new AppError(400, "Unable to update data."));
        }
        if (result['rows'][0]?.fn_check_watchlist_product_keyword_config?.length > 0) {
            res.status(200).json({
                status: "success",
                data: result['rows'][0]?.fn_check_watchlist_product_keyword_config
            });
        } else {
            return next(new AppError(400, "Unable to update data."));
        }
    });
}