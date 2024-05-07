
let Sequelize = null;

/*
    Wrapper db operations based on Sequelize
    Consolidated for easy implementation of database operators.
    Usage: always call dbutil.init(Sequelize) before using any methods before.
    Please add more as you see fit.
*/

var self = module.exports = {

    // Alias
    as: (colname, alias) => {
        return [colname, alias];
    },

    // Distinct.
    distinct: (colname) => {
        return [Sequelize.fn('DISTINCT', Sequelize.col(colname)), colname];
    },

    // Like.
    like: (comparison) => {
        return { [Sequelize.Op.like]: '%' + comparison + '%' };
    },

    // Not Equal.
    ne: (comparison) => {
        return { [Sequelize.Op.not]: comparison };
    },

    // Greater than.
    gt: (comparison) => {
        return { [Sequelize.Op.gt]: comparison };
    },

    // Greater than or equal.
    gte: (comparison) => {
        return { [Sequelize.Op.gte]: comparison }
    },

    // Less than.
    lt: (comparison) => {
        return { [Sequelize.Op.lt]: comparison };
    },

    // Less than or equal.
    lte: (comparison) => {
        return { [Sequelize.Op.lte]: comparison }
    },

    // Where in.
    in: (comparison) => {
        return { [Sequelize.Op.in]: comparison }
    },

    isExist: async (model, cond) => {
        const result = await model.count({ where: cond });

        return result > 0;
    },

    where_effectivity: () => {
        return [
            { effective_from: self.lte(self.current_timestamp()) },
            { effective_to: self.gte(self.current_timestamp()) }
        ];
    },

    current_timestamp: () => {
        return Sequelize.literal('CURRENT_TIMESTAMP');
    },

    // TODO: Flatten result set to one array.
    flatten: (result) => {
        for (var i = 0; i < result.length; i++) {
            //console.log(result[i].Store);

            console.log(Object.keys(result[i]).length);
        }
    },

    // Generic check if the result is empty.
    // ORM returns diff result structure based on usage.
    isEmpty: (result) => {
        if (!result)
            return true;

        if (result.rows)
            return result.rows.length == 0;

        return result.length == 0;
    },

    findOneWithFallback: async (Model, FallbackModel, query) => {
        let result = await Model.findOne(query);

        let isFromFallbackModel = false;

        if (self.isEmpty(result)) {
            result = await FallbackModel.findOne(query);

            if (!self.isEmpty(result))
                isFromFallbackModel = true;
        }

        return {
            result: self.isEmpty(result) ? null : result.dataValues,
            isFromFallbackModel: isFromFallbackModel
        }
    },

    findManyWithFallback: async (Model, FallbackModel, query) => {
        let result = await Model.findAll(query);

        let isFromFallbackModel = false;

        if (self.isEmpty(result)) {
            result = await FallbackModel.findAll(query);

            if (!self.isEmpty(result))
                isFromFallbackModel = true;
        }

        return {
            result: result,
            isFromFallbackModel: isFromFallbackModel
        }
    },

    // Gets the page count based on result count (findAndCountAll).
    // Also renames count -> total_count.
    setPagination: (result, pageSize) => {
        if (!result || !result.rows)
            return;

        let paginationValues = {
            pages: result.rows.length == 0 ? 0 : Math.ceil(result.count / pageSize),
            total_count: result.count
        }

        result.pagination = paginationValues;

        delete result.count;
    },

    // Sets the sequelize object.
    init: (sequelize) => {
        Sequelize = sequelize;
    },

    // Gets the Sequelize instance.
    // Useful for util functions where Sequelize is not declared.
    sequelize: () => {
        return Sequelize;
    }
}