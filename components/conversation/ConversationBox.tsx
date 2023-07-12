'use client'
import { Conversation, Message, User } from '@prisma/client'
import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import useOtherUser from '@/hooks/useOtherUser'
import { FullConversationType } from '@/types'
import Avatar from '../Avatar'
import AvatarGroup from '../AvatarGroup'

interface ConversationBoxProps {
	conversation: FullConversationType
	selected: boolean
}

export default function ConversationBox({
	conversation,
	selected,
}: ConversationBoxProps) {
	const otherUser = useOtherUser(conversation)
	const session = useSession()
	const router = useRouter()

	const handleClick = useCallback(() => {
		router.push(`/conversations/${conversation.id}`)
	}, [conversation.id, router])

	const lastMessage = useMemo(() => {
		const messages = conversation.messages || []

		return messages[messages.length - 1]
	}, [conversation.messages])

	const userEmail = useMemo(() => {
		return session.data?.user?.email
	}, [session.data?.user?.email])

	const hasSeen = useMemo(() => {
		if (!lastMessage) {
			return false
		}
		const seenArray = lastMessage.seen || []
		if (!userEmail) {
			return false
		}
		return (
			seenArray.filter((user) => user.email === userEmail).length !== 0
		)
	}, [userEmail, lastMessage])

	const lastMessageText = useMemo(() => {
		if (lastMessage?.image) {
			return 'Sent an image'
		}

		return lastMessage?.body || 'Started a conversation'
	}, [lastMessage])

	return (
		<div
			onClick={handleClick}
			className={clsx(
				'w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer mb-3',
				selected ? 'bg-neutral-100' : 'bg-white'
			)}
		>
			{conversation.isGroup ? (
				<AvatarGroup users={conversation.users} />
			) : (
				<Avatar user={otherUser} />
			)}
			<div className='min-w-0 flex-1'>
				<div className='focus:outline-none'>
					<div className='flex justify-between items-center mb-1'>
						<p className='text-md font-bold text-gray-900'>
							{conversation.name || otherUser.name}
						</p>
						{lastMessage?.createdAt && (
							<p className='text-xs text-gray-400 font-light'>
								{format(
									new Date(lastMessage.createdAt),
									'p'
								)}
							</p>
						)}
					</div>
					<p
						className={clsx(
							'truncate text-sm',
							hasSeen
								? 'text-gray-500'
								: 'text-black font-medium'
						)}
					>
						{lastMessageText}
					</p>
				</div>
			</div>
		</div>
	)
}
