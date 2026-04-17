import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await login(email, password);
			navigate('/chat');
		} catch (err) {
			setError(err.message || 'Login failed. Please check your credentials.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Login - Genfinita</title>
				<meta name="description" content="Log in to your Genfinita account" />
			</Helmet>
			<Header />
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-muted/30">
				<Card className="w-full max-w-md border shadow-lg">
					<CardHeader>
						<CardTitle className="text-2xl text-foreground">Welcome back</CardTitle>
						<CardDescription>Enter your credentials to access your Genfinita account</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
									{error}
								</div>
							)}
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" className="text-foreground bg-background border focus:border-accent focus:ring-accent" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className="text-foreground bg-background border focus:border-accent focus:ring-accent" />
							</div>
							<Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.98]" disabled={loading}>
								{loading ? 'Logging in...' : 'Login'}
							</Button>
							<p className="text-center text-sm text-muted-foreground">
								Don't have an account?{' '}
								<Link to="/signup" className="text-accent hover:text-accent/80 hover:underline transition-colors">Sign up</Link>
							</p>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
