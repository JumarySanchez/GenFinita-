import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header.jsx';

export default function SignupPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { signup } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (password !== passwordConfirm) {
			setError('Passwords do not match');
			return;
		}

		if (password.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}

		setLoading(true);

		try {
			await signup(email, password, passwordConfirm, name);
			navigate('/chat');
		} catch (err) {
			setError(err.message || 'Signup failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Helmet>
				<title>Sign Up - Genfinita</title>
				<meta name="description" content="Create your Genfinita account" />
			</Helmet>
			<Header />
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-muted/30">
				<Card className="w-full max-w-md border shadow-lg">
					<CardHeader>
						<CardTitle className="text-2xl text-foreground">Create an account</CardTitle>
						<CardDescription>Get started with Genfinita today</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">{error}</div>}
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maya Chen" className="text-foreground bg-background border focus:border-accent focus:ring-accent" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" className="text-foreground bg-background border focus:border-accent focus:ring-accent" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 8 characters" className="text-foreground bg-background border focus:border-accent focus:ring-accent" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="passwordConfirm">Confirm Password</Label>
								<Input id="passwordConfirm" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required placeholder="Re-enter your password" className="text-foreground bg-background border focus:border-accent focus:ring-accent" />
							</div>
							<Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground active:scale-[0.98]" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up'}</Button>
							<p className="text-center text-sm text-muted-foreground">Already have an account?{' '}<Link to="/login" className="text-accent hover:text-accent/80 hover:underline transition-colors">Login</Link></p>
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
