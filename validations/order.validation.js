const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createOrder = {
  body: Joi.object().keys({
    scriptFile: Joi.string().required(),
    sceneLocation: Joi.string(),
    extraInformation: Joi.string(),
    fastDelivery1Day: Joi.boolean(),
    paymentMethod: Joi.string().required(),
    creatorId: Joi.number().integer().required(),
    buyerId: Joi.number().integer().required(),
    packageId: Joi.number().integer().required(),
    totalAmount: Joi.number(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    buyerId: Joi.number().integer(),
    creatorId: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      scriptFile: Joi.string(),
      sceneLocation: Joi.string(),
      extraInformation: Joi.string(),
      fastDelivery1Day: Joi.boolean(),
      paymentMethod: Joi.string(),
      creatorId: Joi.number(),
      status: Joi.string(),
      buyerId: Joi.number,
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required(),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
