import { NextRequest, NextResponse } from "next/server"
import { Rule, RuleSchema } from "@/lib/types/rule"
import { kv } from "@vercel/kv"

// 读取规则
const readRules = async (): Promise<Rule[]> => {
  try {
    const rules = await kv.get<Rule[]>("rules")
    return rules || []
  } catch (error) {
    console.error("Error reading rules:", error)
    return []
  }
}

// 写入规则
const writeRules = async (rules: Rule[]) => {
  try {
    await kv.set("rules", rules)
  } catch (error) {
    console.error("Error writing rules:", error)
    throw new Error("Failed to save rules")
  }
}

export async function GET() {
  try {
    const rules = await readRules()
    return NextResponse.json(rules)
  } catch (error) {
    console.error("Error fetching rules:", error)
    return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate rules
    const rules = Array.isArray(body) ? body : []
    const validatedRules: Rule[] = rules.map((rule) => {
      const validated = RuleSchema.parse(rule)
      return {
        ...validated,
        updateAt: new Date().toISOString(),
      }
    })

    // Get existing rules
    const existingRules = await readRules()

    // Create a map of existing rules by name for quick lookup
    const existingRulesMap = new Map(existingRules.map((rule) => [rule.name, rule]))

    // Update or add rules
    validatedRules.forEach((rule) => {
      existingRulesMap.set(rule.name, rule)
    })

    // Convert map back to array
    const updatedRules = Array.from(existingRulesMap.values())

    await writeRules(updatedRules)
    return NextResponse.json({ message: "Rules saved successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error saving rules:", error)
    return NextResponse.json({ error: "Failed to save rules" }, { status: 500 })
  }
}
