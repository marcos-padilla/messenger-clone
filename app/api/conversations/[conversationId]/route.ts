import getCurrentUser from '@/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/libs/prismadb'

interface IParams {
	conversationId?: string
}
export async function DELETE(
	request: Request,
	{ params }: { params: IParams }
) {
	try {
		const { conversationId } = params
		const currentUser = await getCurrentUser()

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', { status: 500 })
		}
		const existingConversation = await prisma.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				users: true,
			},
		})

		if (!existingConversation) {
			return new NextResponse('Invalid ID', { status: 400 })
		}

		const deletedConversation = await prisma.conversation.deleteMany({
			where: {
				id: conversationId,
				userIds: {
					hasSome: [currentUser.id],
				},
			},
		})

		return NextResponse.json(deletedConversation)
	} catch (e) {
		console.log('🚀 ~ file: route.ts:8 ~ DELETE ~ e:', e)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
