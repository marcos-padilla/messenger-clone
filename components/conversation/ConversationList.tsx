'use client'
import useConversation from '@/hooks/useConversation'
import { FullConversationType } from '@/types'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { MdOutlineGroupAdd } from 'react-icons/md'
import ConversationBox from './ConversationBox'
import GroupChatModal from '../modals/GroupChatModals'
import { User } from '@prisma/client'
import { pusherClient } from '@/libs/pusher'
import { useSession } from 'next-auth/react'
import { find } from 'lodash'

interface ConversationListProps {
	initialItems: FullConversationType[]
	users: User[]
	title?: string
}

export default function ConversationList({
	initialItems,
	users,
	title,
}: ConversationListProps) {
	const [items, setItems] = useState(initialItems)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const router = useRouter()
	const session = useSession()
	const { conversationId, isOpen } = useConversation()

	const pusherKey = useMemo(() => {
		return session.data?.user?.email
	}, [session.data?.user?.email])

	useEffect(() => {
		if (!pusherKey) {
			return
		}
		pusherClient.subscribe(pusherKey)

		const updateHandler = (conversation: FullConversationType) => {
			if (
				conversationId !== conversation.id &&
				conversation.messages[0].seen[0].email !==
					session?.data?.user?.email
			) {
				Notification.requestPermission().then((permission) => {
					if (permission === 'granted') {
						const notification = new Notification(
							conversation.messages[0].seen[0].name!,
							{
								body:
									conversation.messages[0].body ||
									'Sent an image',
							}
						)
						notification.onclick = () => {
							router.push(
								`/conversations/${conversation.id}`
							)
						}
					}
				})
			}
			setItems((prev) =>
				prev.map((currentConversation) => {
					if (currentConversation.id === conversation.id) {
						return {
							...currentConversation,
							messages: conversation.messages,
						}
					}
					return currentConversation
				})
			)
		}

		const newHandler = (conversation: FullConversationType) => {
			setItems((prev) => {
				if (find(prev, { id: conversation.id })) return prev
				return [conversation, ...prev]
			})
		}

		const removeHandler = (conversation: FullConversationType) => {
			setItems((prev) => {
				return [
					...prev.filter(
						(currentConversation) =>
							currentConversation.id !== conversation.id
					),
				]
			})
		}

		pusherClient.bind('conversation:update', updateHandler)
		pusherClient.bind('conversation:new', newHandler)
		pusherClient.bind('conversation:remove', removeHandler)
	}, [pusherKey, router])

	return (
		<>
			<GroupChatModal
				users={users}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<aside
				className={clsx(
					'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200',
					isOpen ? 'hidden' : 'block w-full left-0'
				)}
			>
				<div className='px-5'>
					<div className='flex justify-between mb-4 pt-4 items-center'>
						<div className='text-2xl font-bold text-neutral-800'>
							Messages
						</div>
						<button
							onClick={() => setIsModalOpen(true)}
							className='rounded-full p-2 bg-gray-100 text-gray-600 hover:opacity-75 transition'
						>
							<MdOutlineGroupAdd size={30} />
						</button>
					</div>
					{items.map((item) => (
						<ConversationBox
							key={item.id}
							conversation={item}
							selected={conversationId === item.id}
						/>
					))}
				</div>
			</aside>
		</>
	)
}
