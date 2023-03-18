const { productService } = require("./product.service");
const { watchItemService } = require("./watch-item.service");

class WatchListService {
    async createNewBooksAndAddToWatchlist(books, user) {
        const promises = books.map(async (book) => {
            let product;
            product = await productService.findOne({
                asin: book.faceout.asin,
            });

            if (!product) {
                product = await productService.create({
                    asin: book.faceout.asin,
                    title: book.faceout.title,
                    cover: book.faceout.image?.src,
                    authors: book.faceout.authors || [],
                    manual: true,
                });
            }

            await watchItemService.addToWatchlist(product, user);
        });

        await Promise.all(promises);
    }
}

exports.watchListService = new WatchListService();
