import { Request, Response } from 'express'
import Writer, { IWriter } from '../models/writer.js'
import bcrypt from 'bcrypt'


const checkUser = async (userEmail: string, password: string): Promise<IWriter | null> => {
	try {
		const existingUser: IWriter | null = await Writer.findOne({ email: userEmail })

		if (!existingUser) {
			return null;
		}

		const passwordMatch = await bcrypt.compare(password, existingUser.password_hash);

		if (!passwordMatch) {
			return null;
		}

		return existingUser;
	} catch (error) {
		throw new Error('Error fetching users');
	}
}

export const getUsr = async (req: Request, res: Response) => {
	const { userEmail, password } = req.body
	const user = await checkUser(userEmail, password)

	if (!user) {
		return res.status(400).json({ message: 'Invalid email or password' });
	}

	return user;
}

export const cr8Usr = async (req: Request, res: Response) => {
	try {
		const { userEmail, password, name, lastName } = req.body
		const existingUser = await checkUser(userEmail, password)

		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const user = new Writer({ name, lastName, email: userEmail, password_hash: hashedPassword })

		await user.save()

		res.status(201).json({ message: 'User created successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error })
	}
}

export const upd8Usr = async (req: Request, res: Response) => {
	try {
		const { userEmail, password, name, lastName } = req.body
		const existingUser = await checkUser(userEmail, password)

		if (!existingUser) {
			return res.status(400).json({ message: 'User does not exist' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const updatedUser = await Writer.findByIdAndUpdate(existingUser._id, { email: userEmail, password_hash: hashedPassword, name, lastName }, { new: true })
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' })
		}
		res.json({ message: 'User updated successfully', user: updatedUser })

	} catch (error) {
		res.status(500).json({ message: 'Error updating user', error })
	}
}

export const del8Usr = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		await Writer.findByIdAndDelete(id)
		res.json({ message: 'User deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Error deleting user', error })
	}
}

export { checkUser }
