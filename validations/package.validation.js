const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createPackage = {
  body: Joi.object().keys({
    numberOfVideos: Joi.number().required(),
    totalCost: Joi.number().required(),
    durationPerVideo: Joi.number().required(),
    tiktokVideo: Joi.boolean(),
    instagramStory: Joi.boolean(),
    instagramReels: Joi.boolean(),
    snapchatAds: Joi.boolean(),
    voiceover: Joi.boolean(),
    music: Joi.boolean(),
    subtitle: Joi.boolean(),
    niche: Joi.string(),
  }),
};

const getPackages = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPackage = {
  params: Joi.object().keys({
    packageId: Joi.string().required(),
  }),
};

const updatePackage = {
  params: Joi.object().keys({
    packageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deletePackage = {
  params: Joi.object().keys({
    packageId: Joi.string().required(),
  }),
};

module.exports = {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
};
