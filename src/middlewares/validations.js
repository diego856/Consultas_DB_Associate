const { body } = require('express-validator')

const validations=[
    body('title').notEmpty().withMessage('Debes ingresar un titulo'),
    body('rating')
      .notEmpty().withMessage('Debes ingresar un rating').bail()
      .isNumeric().withMessage('El rating debe ser numérico'),
    body('awards')
      .notEmpty().withMessage('Debes ingresar un número de premios ganados').bail()
      .isNumeric().withMessage('La cantidad de premios debe ser numérica'),
    body('release_date')
      .notEmpty().withMessage('Debes ingresar una fecha de lanzamiento'),
    body('length')
      .notEmpty().withMessage('Debes ingresar un duración para la película').bail()
      .isNumeric().withMessage('La duración debe ser numérica'),
    body('genre_id')
      .notEmpty().withMessage('Debes ingresar un género para la película')
  ]

  module.exports = validations