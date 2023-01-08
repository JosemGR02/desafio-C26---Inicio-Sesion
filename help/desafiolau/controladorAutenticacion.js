import { UserDao } from "../../dao/index.js";


const signUp = async (req, res) => {
    try {
        const { name, lastname, email, password } = req.body

        if (!name || !lastname || !email || !password) return res.send({ success: false })

        const existUser = await UserDao.getOne({ email })

        if (existUser && existUser.password) {
            return res.send({ success: false, error: 'User already exists' })
        }

        if (existUser && !existUser.password) {
            const updateUser = await UserDao.updateById(existUser._id, { ...existUser, password })
            return res.send({ success: true })
        }

        // ACA USAR DECRYPT PARA LA PASSWORD
        await UserDao.save({ name, lastname, email, password })

        res.send({ success: true })
    } catch (error) {
        console.log(`error from AuthRouter-Post`);
        res.send({ success: false })
    }
}

const githubLogin = (req, res) => {
    res.send('Bienvenido desde github')
}


export const AuthControllers = { signUp, githubLogin }