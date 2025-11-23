/**
 * Notion Webhook Worker
 *
 * Receives webhooks from Notion and triggers GitHub Actions deployment
 * via GitHub Repository Dispatch API.
 */

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		// Only accept POST requests
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			const payload = (await request.json()) as any;

			console.log('Received webhook:', payload.type);

			// Only process data_source.content_updated events
			if (payload.type === 'data_source.content_updated') {
				// Trigger GitHub Repository Dispatch
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

			// Ignore other event types
			return new Response('Event ignored', {
				status: 200,
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		} catch (error: any) {
			console.error('Error processing webhook:', error);
			return new Response(`Error: ${error.message}`, {
				status: 500,
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		}
	},
} satisfies ExportedHandler<Env>;
