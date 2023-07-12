import { NextResponse } from 'next/server'
import getCurrentUser from '@/actions/getCurrentUser'
import prisma from '@/libs/prismadb'

export async function POST(request: Request) {
	try {
		const currentUser = await getCurrentUser()
		const body = await request.json()
		const { image, name } = body

		if (!currentUser?.id || !currentUser?.email) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: currentUser.id,
			},
			data: {
				image: image,
				name: name,
			},
		})
		return NextResponse.json(updatedUser)
	} catch (error) {
		console.log('🚀 ~ file: route.ts:9 ~ POST ~ error:', error)
		return new NextResponse('Internal Server Error!!!', { status: 500 })
	}
}
