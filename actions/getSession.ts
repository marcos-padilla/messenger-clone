import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function currentSession() {
	return await getServerSession(authOptions)
}
