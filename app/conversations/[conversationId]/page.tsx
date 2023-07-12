interface IParams {
	conversationId: string
}

export default async function ConversationPage({
	params,
}: {
	params: IParams
}) {
	return <div>Conversation Id</div>
}
