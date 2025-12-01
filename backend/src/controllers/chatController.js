const prisma = require('../utils/prisma');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const startChatSession = async (req, res) => {
    try {
        const { noteId, title } = req.body;

        if (noteId) {
            const note = await prisma.note.findUnique({
                where: { id: noteId }
            });

            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }

            if (note.userId !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        const conversation = await prisma.conversation.create({
            data: {
                title: title || (noteId ? 'Chat with Document' : 'New Chat'),
                userId: req.user.id,
                noteId: noteId || null
            },
            include: {
                note: true,
                messages: true
            }
        });

        res.status(201).json({
            message: 'Chat session started successfully',
            conversation
        });
    } catch (error) {
        console.error('Error starting chat session:', error);
        res.status(500).json({
            message: 'Failed to start chat session',
            error: error.message
        });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                note: true,
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (conversation.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const userMessage = await prisma.message.create({
            data: {
                conversationId,
                role: 'user',
                content
            }
        });

        let systemContext = '';
        if (conversation.note) {
            systemContext = `You are a helpful study assistant. You are helping the user understand the following document:\n\nDocument Title: ${conversation.note.title}\n\nDocument Content:\n${conversation.note.content}\n\nPlease answer the user's questions based on this document. Be helpful, concise, and accurate.`;
        } else {
            systemContext = 'You are a helpful study assistant. Help the user with their questions about studying, learning, or any educational topics.';
        }

        const conversationHistory = conversation.messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        conversationHistory.push({
            role: 'user',
            parts: [{ text: content }]
        });

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

            const chat = model.startChat({
                history: conversationHistory.slice(0, -1),
                generationConfig: {
                    maxOutputTokens: 2000,
                    temperature: 0.7,
                }
            });

            const prompt = conversationHistory.length === 1
                ? `${systemContext}\n\nUser question: ${content}`
                : content;

            const result = await chat.sendMessage(prompt);
            const aiResponse = result.response.text();

            const assistantMessage = await prisma.message.create({
                data: {
                    conversationId,
                    role: 'assistant',
                    content: aiResponse
                }
            });

            res.status(200).json({
                message: 'Message sent successfully',
                userMessage,
                assistantMessage
            });
        } catch (aiError) {
            console.error('AI generation error:', aiError);

            await prisma.message.create({
                data: {
                    conversationId,
                    role: 'assistant',
                    content: 'I apologize, but I encountered an error processing your message. Please try again.'
                }
            });

            res.status(500).json({
                message: 'Failed to generate AI response',
                error: aiError.message
            });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            message: 'Failed to send message',
            error: error.message
        });
    }
};

const getChatSession = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await prisma.conversation.findUnique({
            where: { id },
            include: {
                note: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (conversation.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json({ conversation });
    } catch (error) {
        console.error('Error getting chat session:', error);
        res.status(500).json({
            message: 'Failed to get chat session',
            error: error.message
        });
    }
};

const getAllChatSessions = async (req, res) => {
    try {
        const conversations = await prisma.conversation.findMany({
            where: { userId: req.user.id },
            include: {
                note: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                messages: {
                    select: {
                        id: true,
                        createdAt: true
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.status(200).json({ conversations });
    } catch (error) {
        console.error('Error getting chat sessions:', error);
        res.status(500).json({
            message: 'Failed to get chat sessions',
            error: error.message
        });
    }
};

const deleteChatSession = async (req, res) => {
    try {
        const { id } = req.params;

        const conversation = await prisma.conversation.findUnique({
            where: { id }
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        if (conversation.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await prisma.message.deleteMany({
            where: { conversationId: id }
        });

        await prisma.conversation.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Chat session deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat session:', error);
        res.status(500).json({
            message: 'Failed to delete chat session',
            error: error.message
        });
    }
};

module.exports = {
    startChatSession,
    sendMessage,
    getChatSession,
    getAllChatSessions,
    deleteChatSession
};
