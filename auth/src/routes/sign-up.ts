import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import { BadRequestError, RequestValidationError } from "../errors"
import { validateRequest } from "../middlewares/validate-request"
import { User } from "../models"

const router = express.Router()

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const exists = await User.findOne({ email })

    if (exists) {
      console.log("Email in use")
      throw new BadRequestError("Email in use")
    }

    const user = User.build({ email, password })
    await user.save()

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    )

    req.session = {
      jwt: userJwt,
    }

    res.status(201).send(user)
  }
)

export { router as signUpRouter }
