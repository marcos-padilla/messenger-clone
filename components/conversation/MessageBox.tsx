'use client'

import { FullMessageType } from '@/types'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Avatar from '../Avatar'
import { format } from 'date-fns'
import Image from 'next/image'
interface MessageBoxProps {
	isLast: boolean
	message: FullMessageType
}

export default function MessageBox({ isLast, message }: MessageBoxProps) {
	const session = useSession()
	const isOwn = session?.data?.user?.email === message?.sender?.email
	const seenList = (message.seen || [])
		.filter((user) => user.email !== message?.sender?.email)
		.map((user) => user.name)
		.join(', ')

	return (
		<div className={clsx('flex gap-3 p-4', isOwn && 'justify-end')}>
			<div className={clsx(isOwn && 'order-2')}>
				<Avatar user={message.sender} />
			</div>
			<div
				className={clsx(
					'flex flex-col gap-2',
					isOwn && 'items-end'
				)}
			>
				<div className='flex items-center gap-1'>
					<div className='text-sm text-gray-500'>
						{message.sender.name}
					</div>
					<div className='text-xs text-gray-400'>
						{format(new Date(message.createdAt), 'p')}
					</div>
				</div>
				<div
					className={clsx(
						'text-sm w-fit overflow-hidden',
						isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
						message.image
							? 'rounded-md p-0'
							: 'rounded-full py-2 px-3'
					)}
				>
					{message.image ? (
						<Image
							alt='Image'
							height={288}
							width={288}
							src={message.image}
							className='object-cover cursor-pointer hover:scale-110 transition translate-x-0'
						/>
					) : (
						<div>{message.body}</div>
					)}
				</div>
				{isLast && isOwn && seenList.length > 0 && (
					<div className='text-xs font-light text-gray-500'>{`Seen by ${seenList}`}</div>
				)}
			</div>
		</div>
	)
}
