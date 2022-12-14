import bcrypt from "bcrypt"

export class Password {
  static async toHash(password: string) {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    return passwordHash
  }

  static async compare(suppliedPassword: string, storedPassword: string) {
    const passwordsMatch = await bcrypt.compare(suppliedPassword, storedPassword)
    return passwordsMatch
  }
}
