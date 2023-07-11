import prisma from '@/libs/prismadb'
import getSession from './getSession'

export default async function getUsers() {
	const session = await getSession()
	if (!session?.user?.email) {
		return []
	}

	try {
		const users = await prisma.user.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				NOT: {
					email: session.user.email,
				},
			},
		})

		return users
	} catch (error: any) {
		console.log('🚀 ~ file: getUsers.ts:13 ~ getUsers ~ error:', error)
		return []
	}
}
