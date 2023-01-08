import bcrypt from 'bcryptjs'

var hashPassword = (password) => {
    bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

var isValidPassword = (user, password) => {
    bcrypt.compareSync(password, user.password)
}

export const BCRYPT_VALIDATION = { hashPassword, isValidPassword }