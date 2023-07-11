import bcrypt from 'bcrypt'

import prisma from '@/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { email, name, password } = body

		const hashedPassword = await bcrypt.hash(password, 12)

		if (!email || !name || !password) {
			return new NextResponse('Missing Info!!!', { status: 400 })
		}

		if (password.length < 8) {
			return new NextResponse(
				'Password must have at least 8 characteres!!!',
				{ status: 400 }
			)
		}

		const checkUser = await prisma.user.findUnique({
			where: {
				email,
			},
		})
		if (checkUser) {
			return new NextResponse('User already exist!!!', { status: 400 })
		}

		const user = await prisma.user.create({
			data: {
				email,
				name,
				hashedPassword,
			},
		})

		return NextResponse.json(user)
	} catch (e) {
		console.log('🚀 ~ file: route.ts:43 ~ POST ~ e:', e)
		return new NextResponse('Internal Error!!!', { status: 500 })
	}
}
