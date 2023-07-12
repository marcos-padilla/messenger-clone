import { User } from '@prisma/client'

interface AvatarGroupProps {
	users: User[]
}

export default function AvatarGroup({ users }: AvatarGroupProps) {
	return <div>AvatarGroup</div>
}
