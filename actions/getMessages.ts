import prisma from '@/libs/prismadb'

export default async function getMessages(conversationId: string) {
	try {
		const messages = await prisma.message.findMany({
			where: {
				conversationId,
			},
			include: {
				sender: true,
				seen: true,
			},
			orderBy: {
				createdAt: 'asc',
			},
		})
		return messages
	} catch (e) {
		console.log('🚀 ~ file: getMessages.ts:7 ~ getMessages ~ e:', e)
		return null
	}
}
