class CommonService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return this.model.create(data);
    }

    async find(filter, populate = "") {
        return this.model.find(filter).populate(populate).exec();
    }

    async findOne(filter, populate = "") {
        return this.model.findOne(filter).populate(populate).exec();
    }

    async findById(filter, populate = "") {
        return this.model.findById(filter).populate(populate).exec();
    }

    async findByIdAndUpdate(filter, update) {
        return this.model.findByIdAndUpdate(filter, update).exec();
    }

    async findOneAndUpdate(filter, update, options) {
        return this.model.findOneAndUpdate(filter, update, options).exec();
    }

    async updateMany(filter, update) {
        return this.model.updateMany(filter, update).exec();
    }

    async deleteOne(filter) {
        return this.model.deleteOne(filter).exec();
    }
}

exports.CommonService = CommonService;
