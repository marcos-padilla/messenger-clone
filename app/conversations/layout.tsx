import getConversations from '@/actions/getConversations'
import ConversationList from '@/components/conversation/ConversationList'
import Sidebar from '@/components/sidebar/Sidebar'

export default async function ConversationsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const conversations = await getConversations()
	return (
		<Sidebar>
			<ConversationList initialItems={conversations} />
			<div className='h-full'>{children}</div>
		</Sidebar>
	)
}
