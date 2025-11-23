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
			// Debug: Log all request headers
			const headers: Record<string, string> = {};
			request.headers.forEach((value, key) => {
				headers[key] = value;
			});
			console.log('Request headers:', JSON.stringify(headers, null, 2));
			console.log('Request method:', request.method);
			console.log('Request URL:', request.url);

			// Get request body as text first to inspect it
			const bodyText = await request.text();
			console.log('Request body (raw):', bodyText);

			// Try to parse as JSON
			let payload: any = null;
			try {
				payload = JSON.parse(bodyText);
				console.log('Request body (parsed):', JSON.stringify(payload, null, 2));
			} catch (e) {
				console.log('Request body is not JSON');
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

			console.log('Received webhook:', payload.type);
			console.log('Full payload structure:', Object.keys(payload));

			// Only process data_source.content_updated events
			if (payload.type === 'data_source.content_updated') {
				console.log('Processing data_source.content_updated event');
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
			console.log(`Ignoring event type: ${payload.type}`);
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
