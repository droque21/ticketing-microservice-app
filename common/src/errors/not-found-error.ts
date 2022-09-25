import { CustomError } from "./custom-error"

export class NotFoundError extends CustomError {
  statusCode = 404
  customMessage = "Not Found"
  constructor(message?: string) {
    super(message || "Route not found")
    this.customMessage = message || this.customMessage
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
  serializeErrors() {
    return [{ message: this.customMessage }]
  }
}
