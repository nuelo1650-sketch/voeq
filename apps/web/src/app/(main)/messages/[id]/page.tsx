import { ConversationThread } from '@/components/messages/ConversationThread';

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params;
  return <ConversationThread conversationId={id} />;
}
