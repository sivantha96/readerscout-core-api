const { DB_COLLECTIONS } = require("../constants");
const { default: productModel } = require("../models/product.model");
const { setParamsToURL, getReviewsURL } = require("../utils");
const { detectModifications } = require("../utils/modifications");
const { CommonService } = require("./common.service");
const { logService } = require("./log.service");

class ProductService extends CommonService {
    constructor() {
        super(productModel);
    }

    async saveProduct(product) {
        return super.create({
            asin: product.asin,
            title: product.title,
            rating: product.rating,
            ratings_total: product.ratings_total,
            price: product.buybox_winner?.price,
            last_modified_on: new Date(),
            bestsellers_rank: product.bestsellers_rank,
            link: setParamsToURL(product.link, {
                tag: "readerscout-20",
                linkCode: "ogi",
                language: "en_US",
                th: "1",
                psc: "1",
            }),
            authors: product.authors,
            cover: product.main_image?.link,
            manual: true,
        });
    }

    async updateProduct(foundProduct, product) {
        const newProduct = {
            ...foundProduct.toObject(),
            asin: product.asin,
            title: product.title,
            rating: product.rating,
            ratings_total: product.ratings_total,
            ...(product.buybox_winner?.price ? {  price: product.buybox_winner.price}: {}),
            bestsellers_rank: product.bestsellers_rank,
            last_modified_on: new Date(),
            link: setParamsToURL(product.link, {
                tag: "readerscout-20",
                linkCode: "ogi",
                language: "en_US",
                th: "1",
                psc: "1",
            }),
            reviews_link: setParamsToURL(getReviewsURL(product.asin), {
                tag: "readerscout-20",
                linkCode: "ogi",
                language: "en_US",
                th: "1",
                psc: "1",
                ie: "UTF8",
                reviewerType: "all_reviews",
                sortBy: "recent",
                pageNumber: "1",
            }),
            authors: product.authors,
            cover: product.main_image?.link,
        };

        const modifications = detectModifications(newProduct, foundProduct.toObject());

        await logService.create({
            model: DB_COLLECTIONS.PRODUCTS,
            parent: foundProduct._id,
            changed_by: "SYSTEM",
            modifications,
        });

        return super.findByIdAndUpdate(foundProduct._id, newProduct);
    }

    hasNewUpdates(product, foundProduct) {
        const newRatingTotal = product.ratings_total;
        const newPriceValue = product.buybox_winner?.price?.value;

        const hasRatingUpdate =
            newRatingTotal?.toString() !== foundProduct.ratings_total?.toString();
        const hasPriceUpdate = newPriceValue && newPriceValue?.toString() !== foundProduct.price?.value?.toString();

        return [hasRatingUpdate, hasPriceUpdate];
    }
}

exports.productService = new ProductService();
