import { ContentStyle } from './supabase'
import { sendErrorAlert } from './resend'

// Use raw fetch instead of the Anthropic SDK — the SDK relies on Node.js
// internals that throw "Connection error" on Cloudflare Workers.

interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AnthropicResponse {
  content: Array<{ type: 'text'; text: string }>
}

async function callClaude(
  model: string,
  messages: AnthropicMessage[],
  maxTokens: number
): Promise<AnthropicResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Anthropic API ${res.status}: ${body}`)
  }

  return res.json() as Promise<AnthropicResponse>
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 2,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
}

// Helper to sleep for a given duration
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Retry wrapper with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.min(
          RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1),
          RETRY_CONFIG.maxDelayMs
        )
        console.log(`[${operationName}] Retry ${attempt}/${RETRY_CONFIG.maxRetries}, waiting ${delay}ms`)
        await sleep(delay)
      }

      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      const isRetryable =
        lastError.message.includes('429') ||
        lastError.message.includes('rate limit') ||
        lastError.message.includes('529') ||
        lastError.message.includes('overloaded')

      if (isRetryable && attempt < RETRY_CONFIG.maxRetries) {
        console.warn(`[${operationName}] Retryable error (attempt ${attempt + 1}): ${lastError.message}`)
        continue
      }

      console.error(`[${operationName}] Failed after ${attempt + 1} attempts:`, lastError.message)

      if (attempt >= RETRY_CONFIG.maxRetries) {
        sendErrorAlert(
          `${operationName} Failed`,
          `The ${operationName} operation failed after ${RETRY_CONFIG.maxRetries + 1} attempts.`,
          lastError.message
        ).catch(err => console.error('Failed to send error alert:', err))
      }

      throw lastError
    }
  }

  throw lastError || new Error(`${operationName} failed`)
}

export interface TrendAnalysis {
  title: string
  category: 'models' | 'tools' | 'research' | 'drama' | 'tutorials'
  summary: string
  why_it_matters: string
  tiktok_angle: string
  script: string
  sources: Array<{ url: string; platform: string; title: string }>
  engagement_score: number
}

export interface AnalyzeOptions {
  contentStyle?: ContentStyle
  topics?: string[]
}

const STYLE_PROMPTS: Record<ContentStyle, string> = {
  tiktok: `SCRIPT FORMAT (30-45 seconds when read aloud):
- Open with a hook (pattern interrupt, something surprising)
- Explain the story in plain English (no jargon), 2-3 sentences
- Tell them why they should care (make it personal/relatable)
- End with a hot take or question to drive comments

Tone: Casual, like explaining to a friend who's smart but not technical. Slightly irreverent, not corporate.`,

  youtube: `SCRIPT FORMAT (60-90 seconds when read aloud):
- Open with a compelling hook that sets up the story
- Provide context and background (who, what, when)
- Explain the key details with examples
- Discuss implications and why viewers should care
- End with your take and a call to engage (comment, subscribe)

Tone: Informative but conversational. Like a knowledgeable friend breaking down the news.`,

  linkedin: `SCRIPT FORMAT (LinkedIn post, 150-200 words):
- Open with a thought-provoking observation or statistic
- Explain the business/professional implications
- Provide a balanced analysis with insights
- End with a professional takeaway or question for discussion

Tone: Professional but accessible. Insightful, not sensational. Focus on business impact.`,

  twitter: `SCRIPT FORMAT (Twitter/X thread, 4-6 tweets):
- Tweet 1: Hook that makes people stop scrolling
- Tweets 2-4: Key points, one per tweet, punchy and quotable
- Final tweet: Hot take or question to drive engagement

Tone: Sharp, witty, slightly provocative. Every tweet should stand alone but build a narrative.`,

  newsletter: `SCRIPT FORMAT (Newsletter paragraph, 150-200 words):
- Open with the key news or development
- Explain what happened and why it's significant
- Provide context that helps readers understand the implications
- End with a forward-looking statement or takeaway

Tone: Conversational but informative, like a smart friend catching you up over coffee.`,
}

function extractJSON(text: string): { trends: TrendAnalysis[] } | null {
  // Try direct parse first
  try {
    return JSON.parse(text)
  } catch {
    // Try to find JSON object in the text
    const jsonMatch = text.match(/\{[\s\S]*"trends"[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        // Continue to next attempt
      }
    }

    // Try to find JSON between code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1])
      } catch {
        // Continue
      }
    }

    return null
  }
}

export async function analyzeTrends(rawData: string, options?: AnalyzeOptions): Promise<TrendAnalysis[]> {
  const contentStyle = options?.contentStyle || 'tiktok'
  const stylePrompt = STYLE_PROMPTS[contentStyle]
  const formatName = contentStyle === 'tiktok' ? 'Quick Summary' :
    contentStyle === 'youtube' ? 'Deep Dive' :
      contentStyle === 'linkedin' ? 'Professional Brief' :
        contentStyle === 'newsletter' ? 'Full Report' : 'Key Takeaways'

  const topicsFilter = options?.topics?.length
    ? `\n\nFOCUS AREAS: Prioritize trends related to these topics: ${options.topics.join(', ')}`
    : ''

  const response = await withRetry(
    () => callClaude('claude-3-haiku-20240307', [
      {
        role: 'user',
        content: `You are an AI trend analyst providing a ${formatName} digest. I have raw data from multiple sources about what's trending in AI.

Your job:
1. Identify the 5 most important/interesting AI trends from this data
2. For each, write a short summary a non-technical person can understand
3. Suggest an actionable insight or key takeaway
4. Write a brief analysis in ${formatName} style. Keep under 100 words.
${topicsFilter}

${stylePrompt}

Raw data:
${rawData}

CRITICAL: Respond with ONLY a JSON object. No markdown, no code fences, no explanation. Start your response with { and end with }. Use this exact structure:
{"trends":[{"title":"string","category":"models|tools|research|drama|tutorials","summary":"string","why_it_matters":"string","tiktok_angle":"string","script":"string","sources":[{"url":"string","platform":"string","title":"string"}],"engagement_score":50}]}`,
      },
    ], 4000),
    'analyzeTrends'
  )

  const textBlocks = response.content.filter(block => block.type === 'text')

  if (textBlocks.length === 0) {
    console.error('No text blocks in response:', JSON.stringify(response.content, null, 2))
    throw new Error('No text response from Claude')
  }

  for (const block of textBlocks) {
    if (block.type === 'text') {
      const result = extractJSON(block.text)
      if (result?.trends && Array.isArray(result.trends)) {
        return result.trends
      }
    }
  }

  console.error('Could not parse JSON from response. Text blocks:',
    textBlocks.map(b => b.type === 'text' ? b.text.substring(0, 500) : '').join('\n---\n')
  )

  throw new Error('Failed to parse Claude response as JSON')
}
