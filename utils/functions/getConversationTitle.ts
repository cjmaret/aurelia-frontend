export function getConversationTitle(createdAt: string): string {
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp');
  }

  const hour = date.getHours();

  if (hour >= 0 && hour < 12) {
    return 'Morning Conversation';
  } else if (hour >= 12 && hour < 18) {
    return 'Afternoon Conversation';
  } else {
    return 'Evening Conversation';
  }
}