/**
 * Notion Webhook Worker
 *
 * Receives webhooks from Notion and triggers GitHub Actions deployment
 * via GitHub Repository Dispatch API.
 * Also supports scheduled polling to check for Status changes.
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
			console.log('Full payload:', JSON.stringify(payload, null, 2));

			// Only process data_source.content_updated events
			if (payload.type === 'data_source.content_updated') {
				console.log('Processing data_source.content_updated event');

				// Check if payload contains property change information
				// Log the entire payload structure to investigate
				console.log('=== Investigating payload structure for Status property ===');
				console.log('Payload keys:', Object.keys(payload));

				// Check various possible locations for property change info
				if (payload.data_source) {
					console.log('data_source object:', JSON.stringify(payload.data_source, null, 2));
				}
				if (payload.properties) {
					console.log('properties object:', JSON.stringify(payload.properties, null, 2));
				}
				if (payload.changes) {
					console.log('changes object:', JSON.stringify(payload.changes, null, 2));
				}
				if (payload.entity) {
					console.log('entity object:', JSON.stringify(payload.entity, null, 2));
				}

				// For now, trigger on any content_updated event
				// We'll add Status-specific filtering once we understand the payload structure
				console.log('Triggering deployment (Status check not yet implemented)');
				return await triggerDeployment(env);
			}

			// Log all other event types for debugging
			console.log(`Received event type: ${payload.type}`);
			console.log(`Event payload:`, JSON.stringify(payload, null, 2));
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
