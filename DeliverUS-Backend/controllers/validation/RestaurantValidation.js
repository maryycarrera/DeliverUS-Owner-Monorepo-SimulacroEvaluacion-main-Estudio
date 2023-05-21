const { check } = require('express-validator')
const { checkFileIsImage, checkFileMaxSize } = require('./FileValidationHelper')
const maxFileSize = 2000000 // around 2Mb
// Solución
const models = require('../../models')
const Restaurant = models.Restaurant

// Solución
const checkBusinessRuleOneResturantPromotedByOwner = async (ownerId, promotedValue) => {
  if (promotedValue) {
    try {
      const promotedRestaurants = await Restaurant.findAll({ where: { userId: ownerId, promoted: true } })
      if (promotedRestaurants.length !== 0) {
        return Promise.reject(new Error('You can only promote one restaurant at a time'))
      }
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }
  return Promise.resolve('ok')
}
// const checkPromoted = async (value, { req }) => {
//   try {
//     const restaurant = await Restaurant.findByPk(req.body.restaurantId)
//     const previouslyPromotedRestaurant = await Restaurant.findAll({ where: { userId: req.user.id, isPromoted: true } })
//     if (restaurant.isPromoted === false || previouslyPromotedRestaurant === null) {
//       return Promise.resolve()
//     } else {
//       return Promise.reject(new Error('There cannot be two promoted restaurants.'))
//     }
//   } catch (error) {
//     return Promise.reject(new Error(error))
//   }
// }

module.exports = {
  // Solución
  create: [
    check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
    check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
    check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
    check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
    check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
    check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
    check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
    check('userId').not().exists(),
    check('isPromoted').exists().custom(async (value, { req }) => {
      return checkBusinessRuleOneResturantPromotedByOwner(req.user.id, value)
    })
      .withMessage('You can only promote one restaurant at a time'),
    check('heroImage').custom((value, { req }) => {
      return checkFileIsImage(req, 'heroImage')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('heroImage').custom((value, { req }) => {
      return checkFileMaxSize(req, 'heroImage', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
    check('logo').custom((value, { req }) => {
      return checkFileIsImage(req, 'logo')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('logo').custom((value, { req }) => {
      return checkFileMaxSize(req, 'logo', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
  ],

  // Solución
  update: [
    check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
    check('address').exists().isString().isLength({ min: 1, max: 255 }).trim(),
    check('postalCode').exists().isString().isLength({ min: 1, max: 255 }),
    check('url').optional({ nullable: true, checkFalsy: true }).isString().isURL().trim(),
    check('shippingCosts').exists().isFloat({ min: 0 }).toFloat(),
    check('email').optional({ nullable: true, checkFalsy: true }).isString().isEmail().trim(),
    check('phone').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1, max: 255 }).trim(),
    check('restaurantCategoryId').exists({ checkNull: true }).isInt({ min: 1 }).toInt(),
    check('userId').not().exists(),
    check('isPromoted').exists().custom(async (value, { req }) => {
      return checkBusinessRuleOneResturantPromotedByOwner(req.user.id, value)
    })
      .withMessage('You can only promote one restaurant at a time'),
    check('heroImage').custom((value, { req }) => {
      return checkFileIsImage(req, 'heroImage')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('heroImage').custom((value, { req }) => {
      return checkFileMaxSize(req, 'heroImage', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
    check('logo').custom((value, { req }) => {
      return checkFileIsImage(req, 'logo')
    }).withMessage('Please upload an image with format (jpeg, png).'),
    check('logo').custom((value, { req }) => {
      return checkFileMaxSize(req, 'logo', maxFileSize)
    }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
  ]

  // promote: [
  //   check('isPromoted').exists().custom(checkBusinessRuleOneResturantPromotedByOwner)
  // ]
}
