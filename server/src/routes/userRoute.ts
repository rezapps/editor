import jwt from 'jsonwebtoken'
import express from 'express'

import { cr8Usr, checkUser, del8Usr } from '../controllers/userController.js'

const router = express.Router()

router.post('/login', async (req, res) => {
	const { userEmail, password } = req.body
	const user = await checkUser(userEmail, password)
	if (!user) {
		return res.status(400).json({ message: 'Invalid email or password' });
	}

	const token = jwt.sign(
		{ userId: user._id, email: user.email },
		process.env.JWT_SECRET || 'Aliens_Are_Coming',
		{ expiresIn: '1h' }
	);

	res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

})
router.post('/signup', cr8Usr)


router.delete('/:id', del8Usr)

export default router
