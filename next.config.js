/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"storage.googleapis.com",
			"i.postimg.cc",
			"dxxffxihbcbwpntjdzlk.supabase.co",
			"via.placeholder.com",
			"th.bing.com",
			"www.investopedia.com",
		],
	},
	env: {
		supabase_public_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
		supabase_public_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		supabase_service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		stripe_publishable_key: process.env.NEXT_STRIPE_PUBLISHABLE_KEY,
		stripe_secret_key: process.env.STRIPE_SECRET_KEY,
		VERCEL_URL: process.env.VERCEL_URL,
		admin_fee_id: process.env.ADMIN_FEES_PRICE_ID,
		stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
		sendgrid_api_key: process.env.SENDGRID_API_KEY,
		recaptcha_site_key: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
		recaptcha_secret_key: process.env.RECAPTCHA_SECRET_KEY,
	},
	experimental: {
		serverActions: true,
	},
};

module.exports = nextConfig;
