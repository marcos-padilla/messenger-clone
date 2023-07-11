'use client'
import { User } from '@prisma/client'
import Image from 'next/image'

interface AvatarProps {
	user: User
}

export default function Avatar({ user }: AvatarProps) {
	return (
		<div className='relative'>
			<div className='relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11'>
				<Image
					alt={user.name as string}
					src={user?.image || '/images/placeholder.jpg'}
					fill
				/>
			</div>
		</div>
	)
}
