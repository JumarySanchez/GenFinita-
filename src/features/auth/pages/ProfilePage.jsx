import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { pocketbaseClient as pb } from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header.jsx';
import { User } from 'lucide-react';

export default function ProfilePage() {
	const { currentUser, updateUser } = useAuth();
	const [name, setName] = useState(currentUser?.name || '');
	const [loading, setLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const fileInputRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const formData = new FormData();
			if (name !== currentUser?.name) {
				formData.append('name', name);
			}
			if (selectedFile) {
				formData.append('avatar', selectedFile);
			}
			await updateUser(formData);
			toast({ title: 'Profile updated', description: 'Your profile has been updated successfully' });
			setSelectedFile(null);
		} catch (err) {
			toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to update profile' });
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const avatarUrl = currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : null;
	const initials = currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : currentUser?.email?.[0].toUpperCase();

	return (
		<>
			<Helmet>
				<title>Profile - Genfinita</title>
				<meta name="description" content="Manage your Genfinita profile" />
			</Helmet>
			<Header />
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-muted/30">
				<Card className="w-full max-w-md border shadow-lg">
					<CardHeader>
						<CardTitle className="text-2xl text-foreground">Your profile</CardTitle>
						<CardDescription>Manage your Genfinita account settings</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="flex flex-col items-center gap-4">
								<Avatar className="h-24 w-24 ring-2 ring-accent/30">
									<AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : avatarUrl} alt={currentUser?.name} />
									<AvatarFallback className="text-2xl bg-accent/10 text-accent">{initials || <User className="h-12 w-12" />}</AvatarFallback>
								</Avatar>
								<Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground">Change avatar</Button>
								<input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" value={currentUser?.email || ''} disabled className="text-muted-foreground bg-muted border" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="text-foreground bg-background border focus:border-accent focus:ring-accent" />
							</div>
							<Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.98]" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
