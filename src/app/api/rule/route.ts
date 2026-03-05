import { NextRequest, NextResponse } from "next/server"
import { Rule, RuleSchema } from "@/lib/types/rule"
import { mongoRuleStorage } from "@/lib/storage/mongoRuleStorage"

export async function GET() {
  try {
    const rules = await mongoRuleStorage.getAll()
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

    // Save rules to MongoDB
    await mongoRuleStorage.saveAll(validatedRules)
    return NextResponse.json({ message: "Rules saved successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error saving rules:", error)
    return NextResponse.json({ error: "Failed to save rules" }, { status: 500 })
  }
}
