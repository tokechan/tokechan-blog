/**
 * Notion Webhook Worker
 *
 * Receives webhooks from Notion and triggers GitHub Actions deployment
 * via GitHub Repository Dispatch API.
 *
 * Flow:
 * 1. Notion sends webhook event (data_source.content_updated) when database content changes
 * 2. Worker receives the event and triggers GitHub Repository Dispatch API
 * 3. GitHub Actions workflow is triggered and builds/deploys the blog
 * 4. Build process filters posts by Status = "Published" (handled in lib/notion.ts)
 */

interface Env {
	GITHUB_TOKEN?: string;
}

async function triggerDeployment(env: Env): Promise<Response> {
	const githubResponse = await fetch('https://api.github.com/repos/tokechan/tokechan-blog/dispatches', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3+json',
			'Content-Type': 'application/json',
			'User-Agent': 'Notion-Webhook-Worker',
		},
		body: JSON.stringify({
			event_type: 'notion-content-updated',
			client_payload: {
				timestamp: new Date().toISOString(),
			},
		}),
	});

	if (!githubResponse.ok) {
		const errorText = await githubResponse.text();
		console.error('GitHub API error:', errorText);
		return new Response(`GitHub API error: ${errorText}`, {
			status: 500,
			headers: {
				'Content-Type': 'text/plain',
			},
		});
	}

	console.log('Successfully triggered GitHub workflow');
	return new Response('Deployment triggered', {
		status: 200,
		headers: {
			'Content-Type': 'text/plain',
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		// Handle GET requests for webhook verification/authentication
		if (request.method === 'GET') {
			const url = new URL(request.url);
			const challenge = url.searchParams.get('challenge');

			if (challenge) {
				// Return the challenge value for webhook verification
				return new Response(challenge, {
					status: 200,
					headers: {
						'Content-Type': 'text/plain',
					},
				});
			}

			// Return a simple response for health checks
			return new Response('OK', {
				status: 200,
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		}

		// Only accept POST requests for webhook events
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			// Get request body as text first
			const bodyText = await request.text();

			// Try to parse as JSON
			let payload: Record<string, unknown> | null = null;
			try {
				payload = JSON.parse(bodyText) as Record<string, unknown>;
			} catch {
				console.log('Request body is not JSON');
				return new Response('Invalid JSON', {
					status: 400,
					headers: {
						'Content-Type': 'text/plain',
					},
				});
			}

			// Check if this is a webhook verification request
			if (payload && payload.verification_token) {
				console.log('Webhook verification request received');
				// For verification, we need to return the verification_token
				// Notion will check if we can receive and respond correctly
				return new Response(JSON.stringify({ verification_token: payload.verification_token }), {
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}

			if (!payload) {
				console.log('No payload found, returning OK');
				return new Response('OK', {
					status: 200,
					headers: {
						'Content-Type': 'text/plain',
					},
				});
			}

			console.log('Received webhook event:', payload.type);

			// Process data_source.content_updated events
			// This event is triggered when database content changes, including:
			// - Page content (title, body) changes
			// - Property changes (Status, Category, Tags, etc.)
			// Note: The build process filters posts by Status = "Published" in lib/notion.ts
			if (payload.type === 'data_source.content_updated') {
				console.log('Processing data_source.content_updated event');
				console.log('Event details:', {
					type: payload.type,
							timestamp: new Date().toISOString(),
					hasDataSource: !!payload.data_source,
					hasEntity: !!payload.entity,
				});

				// Trigger deployment
				// The GitHub Actions workflow will:
				// 1. Fetch all posts from Notion API
				// 2. Filter by Status = "Published" (in lib/notion.ts)
				// 3. Build and deploy only published posts
				return await triggerDeployment(env);
			}

			// Log other event types for monitoring
			console.log(`Received unhandled event type: ${payload.type}`);
			return new Response('Event ignored', {
				status: 200,
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		} catch (error) {
			console.error('Error processing webhook:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			return new Response(`Error: ${errorMessage}`, {
				status: 500,
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		}
	},
} satisfies ExportedHandler<Env>;
