'use client'

import { IconType } from 'react-icons'
import clsx from 'clsx'
import Link from 'next/link'

interface MobileItemProps {
	href: string
	label: string
	icon: IconType
	active?: boolean
	onClick?: () => any
}

export default function MobileItem({
	href,
	label,
	icon: Icon,
	active,
	onClick,
}: MobileItemProps) {
	const handleClick = () => {
		if (onClick) {
			return onClick()
		}
	}
	return (
		<Link
			onClick={handleClick}
			href={href}
			className={clsx(
				'group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100',
				active && 'bg-gray-100 text-black'
			)}
		>
			<Icon className='h-6 w-6' />
		</Link>
	)
}
