const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const User = require("../models/user.model");
const paginate = require("../utils/paginate");
const Package = require("../models/package.model");
const Review = require("../models/review.model");
const Order = require("../models/order.model");
const { Op } = require("sequelize");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const user = await User.findOne({ where: { email: userBody.email } });

  if (user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Dit emailadres is al geregistreerd"
    );
  }

  return await User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filters, options) => {
  const { page, limit, sortBy } = options;

  const users = await User.findAndCountAll({
    where: {
      ...filters,
      video1: {
        [Op.ne]: null,
      },
    },
    ...paginate({ page, pageSize: limit }),
    order: [["createdAt", sortBy ? sortBy : "DESC"]],
    include: [Package, Review],
  });

  return {
    data: users.rows,
    meta: {
      pagination: {
        page,
        pageSize: limit,
        pageCount: Math.ceil(users.count / limit),
        total: users.count,
      },
    },
  };
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findOne({
    where: { id },
    include: [{ model: Review }, { model: Package }],
    order: [[Package, "id", "ASC"]],
  });

  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ where: { email }, include: [Review, Order] });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const deletedUser = await User.destroy({ where: { id: userId } });

  return deletedUser;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
