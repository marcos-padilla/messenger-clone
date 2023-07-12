import prisma from '@/libs/prismadb'
import { FullMessageType } from '@/types'

export default async function getMessages(conversationId: string) {
	try {
		const messages: FullMessageType[] = await prisma.message.findMany({
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
