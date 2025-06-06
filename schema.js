const Joi=require("joi");

module.exports.listingschema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.object({
            url: Joi.string().required(),
            filename: Joi.string().required()
        }).optional(),
        price:Joi.number().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
});

module.exports.reviewschema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5).allow('').default(3),
        comment:Joi.string().required(),
    }).required(),
});