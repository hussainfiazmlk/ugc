const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createOffer = {
  body: Joi.object().keys({
    numberOfVideos: Joi.number().required(),
    totalCost: Joi.number().required(),
    durationPerVideo: Joi.number().required(),
    voiceOver: Joi.boolean(),
    music: Joi.boolean(),
    subtitle: Joi.boolean(),
    deliveryTime: Joi.number().required(),
    expiryDate: Joi.number().required(),
    chatId: Joi.number(),
  }),
};

const getOffers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    niches: Joi.string(),
  }),
};

const getOffer = {
  params: Joi.object().keys({
    OfferId: Joi.string().required(),
  }),
};

const updateOffer = {
  params: Joi.object().keys({
    OfferId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteOffer = {
  params: Joi.object().keys({
    OfferId: Joi.string().required(),
  }),
};

module.exports = {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
};
