'use client'
import useConversation from '@/hooks/useConversation'
import { FullMessageType } from '@/types'
import { useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox'
import axios from 'axios'
import { pusherClient } from '@/libs/pusher'
import { find } from 'lodash'

interface BodyProps {
	initialMessages: FullMessageType[]
}

export default function Body({ initialMessages }: BodyProps) {
	const [messages, setMessages] = useState(initialMessages)
	const bottomRef = useRef<HTMLDivElement>(null)

	const { conversationId } = useConversation()

	useEffect(() => {
		axios.post(`/api/conversations/${conversationId}/seen`)
	}, [conversationId])

	useEffect(() => {
		pusherClient.subscribe(conversationId)
		bottomRef?.current?.scrollIntoView()

		const messageHandler = (message: FullMessageType) => {
			axios.post(`/api/conversations/${conversationId}/seen`)

			setMessages((prev) => {
				if (find(prev, { id: message.id })) {
					return prev
				}
				return [...prev, message]
			})
			bottomRef?.current?.scrollIntoView()
		}

		const updateMessageHandler = (newMessage: FullMessageType) => {}
		pusherClient.bind('messages:new', messageHandler)
	})

	return (
		<div className='flex-1 overflow-y-auto'>
			{messages.map((message, i) => (
				<MessageBox
					key={message.id}
					isLast={i === messages.length - 1}
					message={message}
				/>
			))}
			<div ref={bottomRef} className='pt-24' />
		</div>
	)
}
