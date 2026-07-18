import prisma from '../prisma';

export async function listThreads() {
  return prisma.chatThread.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        select: { id: true },
      },
    },
  }).then(threads =>
    threads.map(t => ({
      id: t.id,
      title: t.title,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      messageCount: t.messages.length,
    }))
  );
}

export async function createThread(title?: string) {
  const thread = await prisma.chatThread.create({
    data: { title: title || 'New conversation' },
  });
  return { id: thread.id, title: thread.title, createdAt: thread.createdAt.toISOString(), updatedAt: thread.updatedAt.toISOString() };
}

export async function getThread(id: string) {
  const thread = await prisma.chatThread.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!thread) return null;
  return {
    id: thread.id,
    title: thread.title,
    createdAt: thread.createdAt.toISOString(),
    updatedAt: thread.updatedAt.toISOString(),
    messages: thread.messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      metadata: m.metadata,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}

export async function deleteThread(id: string) {
  await prisma.chatThread.delete({ where: { id } });
}

export async function renameThread(id: string, title: string) {
  const thread = await prisma.chatThread.update({
    where: { id },
    data: { title },
  });
  return { id: thread.id, title: thread.title };
}

export async function addMessage(threadId: string, role: string, content: string, metadata?: Record<string, unknown>) {
  const metadataJson = metadata ? JSON.parse(JSON.stringify(metadata)) : undefined;
  const [message] = await prisma.$transaction([
    prisma.chatMessage.create({
      data: { threadId, role, content, metadata: metadataJson },
    }),
    prisma.chatThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    }),
  ]);
  return { id: message.id, role: message.role, content: message.content, createdAt: message.createdAt.toISOString() };
}

export async function autoTitleThread(threadId: string, firstMessage: string) {
  const title = firstMessage.length > 60 ? firstMessage.slice(0, 57) + '...' : firstMessage;
  await prisma.chatThread.update({
    where: { id: threadId },
    data: { title },
  });
}
