import {
	BedrockRuntimeClient,
	InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { fromIni } from "@aws-sdk/credential-providers";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const client = new BedrockRuntimeClient({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: process.env.AWS_PROFILE
		? fromIni({ profile: process.env.AWS_PROFILE })
		: undefined,
	requestHandler: new NodeHttpHandler({
		connectionTimeout: 5000,
		socketTimeout: 90000,
	}),
});

const MODEL_ID = "us.anthropic.claude-sonnet-4-6";

interface ClaudeResponseBody {
	content: { text: string }[];
}

export async function invokeClaude(
	systemPrompt: string,
	userPrompt: string,
): Promise<string> {
	const command = new InvokeModelCommand({
		modelId: MODEL_ID,
		contentType: "application/json",
		accept: "application/json",
		body: JSON.stringify({
			anthropic_version: "bedrock-2023-05-31",
			max_tokens: 1024,
			system: systemPrompt,
			messages: [
				{ role: "user", content: [{ type: "text", text: userPrompt }] },
			],
		}),
	});

	const result = await client.send(command);
	const body = JSON.parse(
		new TextDecoder().decode(result.body),
	) as ClaudeResponseBody;
	return body.content[0].text;
}
