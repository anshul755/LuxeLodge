const Joi=require("joi");

module.exports.listingschema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().required(),
        price:Joi.number().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
})