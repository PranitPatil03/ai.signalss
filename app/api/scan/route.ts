import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { scanTrendsWithBreakdown } from '@/lib/scanner'
import { isDuplicate } from '@/lib/utils'
import { authorizeAuthenticatedOrCron } from '@/lib/admin-auth'

export const maxDuration = 120 // Allow up to 2 minutes for scanning (more sources now)

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeAuthenticatedOrCron(request)
    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    console.log('Starting trend scan...')

    // Run the scanner with breakdown
    const { trends, sourceBreakdown } = await scanTrendsWithBreakdown()

    if (trends.length === 0) {
      return NextResponse.json({
        message: 'No trends found',
        count: 0,
        sourceBreakdown,
      })
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0]

    // Get recent trends from last 48 hours for deduplication
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0]

    const { data: recentTrends } = await supabaseAdmin
      .from('trends')
      .select('title')
      .gte('date', twoDaysAgoStr)

    const existingTitles = recentTrends?.map(t => t.title) || []

    // Filter out duplicate trends (>80% similarity)
    const uniqueTrends = trends.filter(trend => {
      if (isDuplicate(trend.title, existingTitles, 0.8)) {
        console.log(`Skipping duplicate trend: ${trend.title}`)
        return false
      }
      // Also check against trends we're about to insert
      existingTitles.push(trend.title)
      return true
    })

    console.log(`Filtered ${trends.length - uniqueTrends.length} duplicate trends`)

    if (uniqueTrends.length === 0) {
      return NextResponse.json({
        message: 'No new unique trends found',
        count: 0,
        duplicatesSkipped: trends.length,
        sourceBreakdown,
      })
    }

    // Clear existing trends for today (in case of re-run)
    await supabaseAdmin
      .from('trends')
      .delete()
      .eq('date', today)

    // Insert new trends
    const trendsToInsert = uniqueTrends.map(trend => ({
      title: trend.title,
      category: trend.category,
      summary: trend.summary,
      why_it_matters: trend.why_it_matters,
      tiktok_angle: trend.tiktok_angle,
      script: trend.script,
      sources: trend.sources,
      engagement_score: trend.engagement_score,
      date: today,
    }))

    const { error } = await supabaseAdmin
      .from('trends')
      .insert(trendsToInsert)

    if (error) {
      console.error('Failed to insert trends:', error)
      return NextResponse.json(
        { error: 'Failed to save trends' },
        { status: 500 }
      )
    }

    console.log(`Scan complete. Saved ${uniqueTrends.length} trends (${trends.length - uniqueTrends.length} duplicates skipped).`)

    return NextResponse.json({
      message: 'Scan complete',
      count: uniqueTrends.length,
      duplicatesSkipped: trends.length - uniqueTrends.length,
      sourceBreakdown,
      trends: uniqueTrends.map(t => t.title),
    })
  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { error: 'Scan failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
