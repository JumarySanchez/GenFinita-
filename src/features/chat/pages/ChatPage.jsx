import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useIntegratedAi } from '@/features/chat/hooks/useIntegratedAi.jsx';
import { pocketbaseClient as pb } from '@/lib/pocketbaseClient';
import IntegratedAiChat from '@/features/chat/components/IntegratedAiChat.jsx';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2, User, LogOut, MessageSquare } from 'lucide-react';

export default function ChatPage() {
	const { currentUser, logout, subscriptionPlan, trialRemaining, hasGeneratorAccess, consumeTrialUse, startTrial } = useAuth();
	const [conversations, setConversations] = useState([]);
	const [currentConversationId, setCurrentConversationId] = useState(null);
	const [conversationTitle, setConversationTitle] = useState('New conversation');
	const { messages, isStreaming, isLoadingHistory, sendMessage: originalSendMessage, clearMessages } = useIntegratedAi();

	const loadConversations = useCallback(async () => {
		try {
			const records = await pb.collection('conversations').getFullList({ filter: `userId = "${currentUser.id}"`, sort: '-updatedAt', $autoCancel: false });
			setConversations(records);
		} catch (err) {
			console.error('Failed to load conversations:', err);
		}
	}, [currentUser.id]);

	const handleNewChat = useCallback(() => {
		setCurrentConversationId(null);
		setConversationTitle('New conversation');
		localStorage.removeItem('currentConversationId');
		clearMessages();
	}, []);

	const activateTrial = useCallback(() => {
		startTrial();
		toast({
			title: 'Trial started',
			description: 'You can now generate content in the studio.',
		});
	}, [startTrial]);

	const loadConversation = useCallback(async (conversationId) => {
		try {
			const conversation = await pb.collection('conversations').getOne(conversationId, { $autoCancel: false });
			setConversationTitle(conversation.title);
			setCurrentConversationId(conversationId);
			localStorage.setItem('currentConversationId', conversationId);
		} catch (err) {
			console.error('Failed to load conversation:', err);
			if (err.status === 404) {
				localStorage.removeItem('currentConversationId');
				setCurrentConversationId(null);
				setConversationTitle('New conversation');
				toast({ title: 'Conversation not found', description: 'This conversation was deleted. Starting a new chat...' });
			} else {
				toast({ variant: 'destructive', title: 'Error', description: 'Failed to load conversation' });
			}
		}
	}, []);

	useEffect(() => {
		loadConversations();
		const savedConversationId = localStorage.getItem('currentConversationId');
		if (savedConversationId) {
			loadConversation(savedConversationId);
		}
	}, [loadConversations, loadConversation]);

	const wrappedSendMessage = useCallback(async (text, images) => {
		if (!hasGeneratorAccess) {
			toast({
				variant: 'destructive',
				title: 'Trial required',
				description: 'Start a free trial or upgrade to keep generating.',
			});
			return;
		}

		await originalSendMessage(text, images);

		if (subscriptionPlan === 'trial') {
			consumeTrialUse();
		}

		const title = text.slice(0, 50) + (text.length > 50 ? '...' : '');
		if (currentConversationId) {
			await pb.collection('conversations').update(currentConversationId, { updatedAt: new Date().toISOString() }, { $autoCancel: false });
		} else {
			const newConversation = await pb.collection('conversations').create({ title, userId: currentUser.id, firstMessage: text, messages: [] }, { $autoCancel: false });
			setCurrentConversationId(newConversation.id);
			setConversationTitle(title);
			localStorage.setItem('currentConversationId', newConversation.id);
			await loadConversations();
		}
	}, [consumeTrialUse, currentConversationId, currentUser.id, hasGeneratorAccess, loadConversations, originalSendMessage, subscriptionPlan]);

	const handleDeleteConversation = async (conversationId) => {
		try {
			await pb.collection('conversations').delete(conversationId, { $autoCancel: false });
			if (currentConversationId === conversationId) {
				handleNewChat();
			}
			await loadConversations();
			toast({ title: 'Conversation deleted', description: 'The conversation has been removed' });
		} catch (err) {
			toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete conversation' });
		}
	};

	const avatarUrl = currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : null;
	const initials = currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : currentUser?.email?.[0].toUpperCase();
	const promptSuggestions = ['Explain quantum computing', 'Write a poem', 'Generate a video of a sunset', 'Create an animated explainer video', 'Make a video showing a day in the life', 'Generate a cinematic video of nature'];

	return (
		<>
			<Helmet><title>{`Chat - ${conversationTitle} - Genfinita`}</title><meta name="description" content="Chat with AI assistant on Genfinita" /></Helmet>
			<div className="flex h-screen">
				<aside className="w-64 border-r bg-sidebar-background flex flex-col">
					<div className="p-4 border-b">
						<div className="flex items-center gap-3 mb-4">
							<Avatar className="ring-2 ring-accent/30"><AvatarImage src={avatarUrl} alt={currentUser?.name} /><AvatarFallback className="bg-accent/10 text-accent">{initials || <User className="h-5 w-5" />}</AvatarFallback></Avatar>
							<div className="flex-1 overflow-hidden"><p className="font-medium truncate text-sidebar-foreground">{currentUser?.name || 'User'}</p><p className="text-xs text-sidebar-foreground/70 truncate">{currentUser?.email}</p></div>
						</div>
						<Button onClick={handleNewChat} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm"><Plus className="mr-2 h-4 w-4" />New Chat</Button>
					</div>
					<div className="flex-1 overflow-y-auto p-4"><div className="space-y-2">{conversations.map((conv) => (<div key={conv.id} className={`group flex items-center gap-2 p-3 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer ${currentConversationId === conv.id ? 'bg-sidebar-accent border border-accent/30' : ''}`} onClick={() => loadConversation(conv.id)}><MessageSquare className="h-4 w-4 text-accent flex-shrink-0" /><span className="flex-1 truncate text-sm text-sidebar-foreground">{conv.title}</span><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={(e) => e.stopPropagation()}><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete conversation</AlertDialogTitle><AlertDialogDescription>This will permanently delete this conversation. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteConversation(conv.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>))}</div></div>
					<div className="p-4 border-t"><Button onClick={logout} variant="ghost" className="w-full hover:bg-sidebar-accent hover:text-accent" size="sm"><LogOut className="mr-2 h-4 w-4" />Logout</Button></div>
				</aside>
				<main className="flex-1 flex flex-col bg-background">
					<div className="border-b px-6 py-4 bg-card flex items-center justify-between gap-4">
						<div>
							<h1 className="text-xl font-semibold text-foreground">{conversationTitle}</h1>
							<p className="text-sm text-muted-foreground">
								{subscriptionPlan === 'pro' ? 'Creator Pro active' : subscriptionPlan === 'student' ? 'Student plan active' : subscriptionPlan === 'trial' ? `${trialRemaining} trial generations left` : 'Free account - start a trial to generate content'}
							</p>
						</div>
						{subscriptionPlan !== 'pro' && subscriptionPlan !== 'student' && (
							<Button onClick={activateTrial} className="bg-accent hover:bg-accent/90 text-accent-foreground">Start trial</Button>
						)}
					</div>
					<div className="flex-1 overflow-hidden relative">
						{!hasGeneratorAccess && (
							<div className="absolute inset-x-0 top-0 z-20 mx-auto mt-4 w-[min(100%-2rem,56rem)] rounded-2xl border border-accent/30 bg-background/90 p-4 shadow-xl backdrop-blur">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<p className="font-semibold text-foreground">Your trial has not started yet</p>
										<p className="text-sm text-muted-foreground">Start a free trial to unlock video and content generation.</p>
									</div>
									<Button onClick={activateTrial} className="bg-primary hover:bg-primary/90 text-primary-foreground">Start free trial</Button>
								</div>
							</div>
						)}
						{messages.length === 0 && !currentConversationId && !isLoadingHistory && <div className="absolute inset-0 flex items-center justify-center p-8"><div className="max-w-2xl w-full space-y-8"><div className="text-center"><h2 className="text-2xl font-semibold mb-2 text-foreground">Start a new conversation</h2><p className="text-muted-foreground">Choose a prompt below or type your own message</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{promptSuggestions.map((prompt, index) => (<Card key={index} className="p-4 hover:bg-accent/10 hover:border-accent/50 cursor-pointer transition-all border" onClick={() => wrappedSendMessage(prompt, [])}><p className="text-sm text-foreground">{prompt}</p></Card>))}</div></div></div>}
						<IntegratedAiChat messages={messages} isStreaming={isStreaming} isLoadingHistory={isLoadingHistory} sendMessage={wrappedSendMessage} clearMessages={clearMessages} />
					</div>
				</main>
			</div>
		</>
	);
}
