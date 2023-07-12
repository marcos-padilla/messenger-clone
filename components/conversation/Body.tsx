import { Conversation, User } from '@prisma/client'

interface BodyProps {
	conversation: Conversation & {
		users: User[]
	}
}

export default function Body({ conversation }: BodyProps) {
	return <div className='flex-1 overflow-y-auto'>Body</div>
}
