import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import { MessageSquare, History, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CreatorPlatformSections from '@/features/marketing/components/CreatorPlatformSections.jsx';

const AnimatedBackground = () => (
	<div className="hero-animated-bg">
		<div className="hero-layer-base" />
		<div className="hero-layer-grid" />
		<div className="hero-layer-wave-one" />
		<div className="hero-layer-wave-two" />
		<div className="hero-layer-wave-three" />
		<div className="hero-layer-pointer" />
		<div className="hero-layer-vignette" />
	</div>
);

export default function HomePage() {
	const { isAuthenticated, subscriptionPlan, trialRemaining, startTrial, upgradeSubscription, verifyStudentAndUpgrade } = useAuth();
	const navigate = useNavigate();
	const [studentEmail, setStudentEmail] = useState('');
	const [studentId, setStudentId] = useState('');
	const [studentMessage, setStudentMessage] = useState('');
	const [studentError, setStudentError] = useState('');

	const activateTrial = () => {
		startTrial();
		navigate('/signup');
	};

	const activatePlan = (plan) => {
		upgradeSubscription(plan);
		navigate(isAuthenticated ? '/chat' : '/signup');
	};

	const activateStudentPlan = () => {
		setStudentError('');
		setStudentMessage('');

		const result = verifyStudentAndUpgrade({
			studentEmail,
			studentId,
		});

		if (!result.ok) {
			setStudentError(result.error);
			return;
		}

		setStudentMessage('Student plan applied. Continue to create your account.');
		navigate(isAuthenticated ? '/chat' : '/signup');
	};

	const handleHeroPointerMove = (event) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		event.currentTarget.style.setProperty('--hero-pointer-x', `${x.toFixed(2)}%`);
		event.currentTarget.style.setProperty('--hero-pointer-y', `${y.toFixed(2)}%`);
	};

	const handleHeroPointerLeave = (event) => {
		event.currentTarget.style.setProperty('--hero-pointer-x', '50%');
		event.currentTarget.style.setProperty('--hero-pointer-y', '45%');
	};

	const features = [
		{ icon: MessageSquare, title: 'Smart conversations', description: 'Chat naturally with an AI assistant that understands context and provides thoughtful responses' },
		{ icon: History, title: 'Conversation history', description: 'Access all your past conversations instantly, organized and searchable' },
		{ icon: Sparkles, title: 'Image generation', description: 'Create stunning images from text descriptions with built-in AI image generation' },
	];

	return (
		<>
			<Helmet>
				<title>Genfinita - AI video and content generator</title>
				<meta name="description" content="Genfinita helps creators generate short-form videos, ads, brand visuals, and repurposed content with AI" />
			</Helmet>
			<Header />
			<main>
				<section
					className="retro-hero-shell relative min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-20 overflow-hidden"
					onMouseMove={handleHeroPointerMove}
					onMouseLeave={handleHeroPointerLeave}
				>
					<AnimatedBackground />
					<div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-medium text-foreground shadow-lg backdrop-blur">
						<span className="h-2 w-2 rounded-full bg-accent" />
						{subscriptionPlan === 'pro' ? 'Creator Pro active' : subscriptionPlan === 'student' ? 'Student plan active' : subscriptionPlan === 'trial' ? `${trialRemaining} trial generations left` : 'Free account ready'}
					</div>
					<div className="hero-content max-w-4xl mx-auto text-center space-y-8">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance text-foreground drop-shadow-sm">The creator operating system for AI video and content</h1>
						</motion.div>
						<motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">Generate short-form videos, ad creatives, brand visuals, hooks, captions, and repurposed content from one workspace.</motion.p>
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
							{isAuthenticated ? <Link to="/chat"><Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">Open Studio<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Button></Link> : <><Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" onClick={activateTrial}>Start free trial<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></Button><Link to="/login"><Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground shadow-md">Login</Button></Link></>}
						</motion.div>
					</div>
				</section>
				<section className="px-4 py-10 bg-background">
					<div className="max-w-5xl mx-auto">
						<Card className="retro-bio-card border-accent/40 shadow-xl shadow-primary/10">
							<CardContent className="p-8 md:p-10">
								<p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold mb-4">Founder Story</p>
								<p className="text-base md:text-lg text-foreground/90 leading-relaxed">
										Shyne had a clear vision for Genfinita and led the concept with purpose from the beginning. In partnership with
										{' '}
										<a
											href="https://visionbydevs.com"
											target="_blank"
											rel="noopener noreferrer"
											className="font-semibold text-accent underline decoration-accent/60 underline-offset-4 hover:text-primary transition-colors"
										>
											VisionByDevs
										</a>,
										she was able to bring that vision to life. Together with her team, she transformed the idea into an elegant,
										high-impact platform that reflects both innovation and execution at the highest level.
								</p>
							</CardContent>
						</Card>
					</div>
				</section>
				<section className="py-20 px-4 bg-background">
					<div className="max-w-6xl mx-auto">
						<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground">Everything you need for creator-grade AI output</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Built to support subscription plans, free trials, branded assets, and download-style installation.</p>
						</motion.div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
							{features.map((feature, index) => (
								<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
									<Card className="h-full hover:shadow-lg hover:shadow-primary/10 transition-all border"><CardContent className="p-8"><feature.icon className="h-12 w-12 text-accent mb-4" /><h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3><p className="text-muted-foreground leading-relaxed">{feature.description}</p></CardContent></Card>
								</motion.div>
							))}
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-10">
							<Card className="border bg-background/80 backdrop-blur shadow-lg">
								<CardContent className="p-6 space-y-4">
									<p className="text-sm font-medium text-accent uppercase tracking-wide">Free Trial</p>
									<h3 className="text-xl font-semibold text-foreground">Try the generator first</h3>
									<p className="text-muted-foreground">Get a limited run of AI video and content generation before upgrading.</p>
									<Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={activateTrial}>Start trial</Button>
								</CardContent>
							</Card>
							<Card className="border border-accent/40 bg-gradient-to-br from-primary/10 via-background to-accent/10 shadow-lg ring-1 ring-accent/20">
								<CardContent className="p-6 space-y-4">
									<p className="text-sm font-medium text-accent uppercase tracking-wide">Creator Pro</p>
									<h3 className="text-xl font-semibold text-foreground">Subscription for active creators</h3>
									<p className="text-muted-foreground">Unlock unlimited generation, more styles, and faster workflows.</p>
									<Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => activatePlan('pro')}>Go Pro</Button>
								</CardContent>
							</Card>
							<Card className="border bg-background/80 backdrop-blur shadow-lg">
								<CardContent className="p-6 space-y-4">
									<p className="text-sm font-medium text-accent uppercase tracking-wide">Student Plan</p>
									<h3 className="text-xl font-semibold text-foreground">Reduced price for students</h3>
									<p className="text-muted-foreground">Use a valid student email and student ID to unlock discounted pricing at $29.99/mo.</p>
									<input
										type="email"
										placeholder="student@university.edu"
										value={studentEmail}
										onChange={(e) => setStudentEmail(e.target.value)}
										className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
									/>
									<input
										type="text"
										placeholder="Student ID"
										value={studentId}
										onChange={(e) => setStudentId(e.target.value)}
										className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
									/>
									{studentError && <p className="text-xs text-destructive">{studentError}</p>}
									{studentMessage && <p className="text-xs text-accent">{studentMessage}</p>}
									<Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={activateStudentPlan}>Apply student discount</Button>
								</CardContent>
							</Card>
							<Card className="border bg-background/80 backdrop-blur shadow-lg">
								<CardContent className="p-6 space-y-4">
									<p className="text-sm font-medium text-accent uppercase tracking-wide">Downloadable access</p>
									<h3 className="text-xl font-semibold text-foreground">Install from the website</h3>
									<p className="text-muted-foreground">Use the browser install prompt to launch the app like a downloaded tool.</p>
									<Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild><Link to="/signup">Create account</Link></Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<CreatorPlatformSections />
			</main>
			<footer className="border-t py-8 px-4 bg-muted/30">
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-accent" /><span className="font-semibold text-foreground">Genfinita</span></div>
					<div className="flex gap-6"><span className="hover:text-accent transition-colors cursor-pointer">Privacy Policy</span><span className="hover:text-accent transition-colors cursor-pointer">Terms of Service</span></div>
					<span>© 2026 Genfinita. All rights reserved.</span>
				</div>
			</footer>
		</>
	);
}
