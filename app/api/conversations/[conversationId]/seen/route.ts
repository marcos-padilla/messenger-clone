import getCurrentUser from '@/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/libs/prismadb'

interface IParams {
	conversationId?: string
}

export async function POST(request: Request, { params }: { params: IParams }) {
	try {
		const currentUser = await getCurrentUser()
		const { conversationId } = params

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const conversation = await prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				messages: {
					include: {
						seen: true,
					},
				},
				users: true,
			},
		})

		if (!conversation) {
			return new NextResponse('Invalid ID', { status: 404 })
		}
		const lastMessage =
			conversation.messages[conversation.messages.length - 1]
		if (!lastMessage) {
			return NextResponse.json(conversation)
		}
		const updatedMessage = await prisma.message.update({
			where: {
				id: lastMessage.id,
			},
			include: {
				sender: true,
				seen: true,
			},
			data: {
				seen: {
					connect: {
						id: currentUser.id,
					},
				},
			},
		})

		return NextResponse.json(updatedMessage)
	} catch (e) {
		console.log('🚀 ~ file: route.ts:7 ~ POST ~ e:', e)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
