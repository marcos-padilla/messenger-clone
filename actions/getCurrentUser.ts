import prisma from '@/libs/prismadb'
import getSession from './getSession'

export default async function getCurrentUser() {
	try {
		const session = await getSession()
		if (!session?.user?.email) {
			return null
		}

		const currentUser = await prisma.user.findUnique({
			where: {
				email: session.user.email as string,
			},
		})

		if (!currentUser) return null
		return currentUser
	} catch (error) {
		console.log(
			'🚀 ~ file: getCurrentUser.ts:8 ~ getCurrentUser ~ error:',
			error
		)
		return null
	}
}
