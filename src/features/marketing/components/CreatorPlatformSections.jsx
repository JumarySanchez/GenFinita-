import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CircuitBoard, Rocket, Sparkles, TrendingUp } from 'lucide-react';

const differentiators = [
	{
		number: '01',
		title: 'Simplify video creation',
		description: 'Let users create high-quality videos quickly using AI, with no technical or editing skills required.',
		highlight: 'Fast, simple, effective',
	},
	{
		number: '02',
		title: 'Automate content workflow',
		description: 'Transform ideas into finished videos and schedule them for publishing automatically.',
		highlight: 'One prompt to publish',
	},
	{
		number: '03',
		title: 'Optimize for social media growth',
		description: 'Format, time, and enhance videos for maximum engagement on TikTok, YouTube, and Instagram.',
		highlight: 'Built for social reach',
	},
	{
		number: '04',
		title: 'Support consistent content and monetization',
		description: 'Help users maintain regular posting, grow their audience, and turn content into income opportunities.',
		highlight: 'Growth that pays back',
	},
];

const smartFeatures = [
	{ icon: Sparkles, title: 'AI ad generator', description: 'Create winning ad variations with script testing built in.' },
	{ icon: TrendingUp, title: 'Viral hook engine', description: 'Generate scroll-stopping hooks by niche or offer.' },
	{ icon: CircuitBoard, title: 'Competitor style cloner', description: 'Rebuild the pattern, not the copy, from competitor inspiration.' },
	{ icon: Rocket, title: 'Content repurposing machine', description: 'Turn one input into clips, captions, and post ideas.' },
];

const plans = [
	{ name: 'Free Trial', price: '$0', summary: 'Test the core generator before you subscribe.', features: ['Limited video generations', 'Brand preset starter', 'Basic exports'], cta: 'Start free trial', href: '/signup', featured: false },
	{ name: 'Student', price: '$29.99/mo', summary: 'Discounted access for verified students.', features: ['Requires .edu email', 'Valid student ID check', 'Same generator core features'], cta: 'Get student plan', href: '/signup', featured: false },
	{ name: 'Creator Pro', price: '$49.99/mo', summary: 'For creators shipping content every day.', features: ['Unlimited brand kits', 'More voiceover styles', 'Video + caption automation'], cta: 'Upgrade now', href: '/signup', featured: true },
	{ name: 'Studio', price: '$99.99/mo', summary: 'For teams and agencies scaling multiple brands.', features: ['Multi-brand workspaces', 'Shared asset library', 'Team review and approvals'], cta: 'Contact sales', href: '/login', featured: false },
];

export default function CreatorPlatformSections() {
	return (
		<>
			<section className="py-24 px-4 bg-background">
				<div className="max-w-6xl mx-auto space-y-12">
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center space-y-4">
						<p className="text-sm uppercase tracking-[0.4em] text-accent font-semibold">Objectives</p>
						<h2 className="text-3xl md:text-5xl font-black text-balance text-foreground">What makes Genfinita different</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">Built from the product goals in your reference: simpler creation, automated publishing, better growth, and consistent monetization for creators.</p>
					</motion.div>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
						{differentiators.map((item, index) => (
							<motion.div key={item.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.08 }}>
								<Card className="h-full overflow-hidden border border-white/40 bg-gradient-to-br from-primary/12 via-background to-accent/10 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur">
									<CardContent className="p-0">
										<div className="flex h-full min-h-[320px] flex-col justify-between rounded-[2rem] border border-white/50 p-6 text-foreground" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.18))' }}>
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-sm font-semibold tracking-[0.3em] text-accent">{item.number}</p>
													<h3 className="mt-4 max-w-[14rem] text-xl font-semibold uppercase leading-tight">{item.title}</h3>
												</div>
												<div className="rounded-full border border-accent/40 bg-accent/10 p-2 text-accent">
													<ArrowRight className="h-5 w-5" />
												</div>
											</div>
											<div className="space-y-4">
												<p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{item.highlight}</p>
												<p className="text-base leading-relaxed text-foreground/80">{item.description}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section className="py-20 px-4 bg-muted/30">
				<div className="max-w-6xl mx-auto space-y-12">
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
						<h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground">Smart features that make it feel high-ticket</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Give creators leverage with premium-style automation on top of the core objectives above.</p>
					</motion.div>
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
						{smartFeatures.map((feature, index) => (
							<motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.08 }}>
								<Card className="h-full border bg-background/80 shadow-md hover:shadow-lg transition-all">
									<CardContent className="p-6 space-y-4">
										<feature.icon className="h-10 w-10 text-accent" />
										<h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
										<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section className="py-20 px-4 bg-background">
				<div className="max-w-6xl mx-auto space-y-12">
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center">
						<h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-foreground">Pricing that supports a free trial and a real subscription flow</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Start free, then move into a paid plan when the workflow is doing real work for you.</p>
					</motion.div>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
						{plans.map((plan, index) => (
							<motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }}>
								<Card className={`h-full border shadow-lg ${plan.featured ? 'border-accent ring-1 ring-accent/20' : ''}`}>
									<CardContent className="p-8 space-y-6">
										<div>
											<p className="text-sm font-medium uppercase tracking-wide text-accent">{plan.name}</p>
											<div className="mt-2 flex items-end gap-2"><span className="text-3xl font-bold text-foreground">{plan.price}</span><span className="text-sm text-muted-foreground">per creator</span></div>
											<p className="mt-3 text-muted-foreground">{plan.summary}</p>
										</div>
										<ul className="space-y-3 text-sm text-muted-foreground">
											{plan.features.map((feature) => <li key={feature} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-accent" /><span>{feature}</span></li>)}
										</ul>
										<Button asChild className={`w-full ${plan.featured ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}`} variant={plan.featured ? 'default' : 'outline'}><Link to={plan.href}>{plan.cta}</Link></Button>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
					<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
						<Card className="border bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-xl">
							<CardContent className="p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
								<div>
									<h3 className="text-2xl font-semibold mb-2">Install the app from your browser</h3>
									<p className="opacity-90 max-w-2xl">With the PWA install setup, creators can add the app to their device and launch it like a downloaded product.</p>
								</div>
								<Button asChild variant="secondary" className="bg-background text-foreground hover:bg-background/90"><Link to="/signup">Create free account</Link></Button>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</section>
		</>
	);
}
