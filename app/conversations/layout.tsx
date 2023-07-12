import getConversations from '@/actions/getConversations'
import getUsers from '@/actions/getUsers'
import ConversationList from '@/components/conversation/ConversationList'
import Sidebar from '@/components/sidebar/Sidebar'

export default async function ConversationsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const conversations = await getConversations()
	const users = await getUsers()
	return (
		<Sidebar>
			<ConversationList
				initialItems={conversations}
				users={users}
				title='Messages'
			/>
			<div className='h-full'>{children}</div>
		</Sidebar>
	)
}
