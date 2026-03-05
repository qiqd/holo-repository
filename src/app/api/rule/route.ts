import { NextRequest, NextResponse } from "next/server"
import { Rule, RuleSchema } from "@/lib/types/rule"
import fs from "fs"
import path from "path"

// 规则存储文件路径
const RULES_FILE = path.join(process.cwd(), "data", "rules.json")

// 确保数据目录存在
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// 读取规则
const readRules = (): Rule[] => {
  ensureDataDir()
  if (fs.existsSync(RULES_FILE)) {
    try {
      const data = fs.readFileSync(RULES_FILE, "utf8")
      return JSON.parse(data)
    } catch (error) {
      console.error("Error reading rules file:", error)
      return []
    }
  }
  return []
}

// 写入规则
const writeRules = (rules: Rule[]) => {
  ensureDataDir()
  fs.writeFileSync(RULES_FILE, JSON.stringify(rules, null, 2))
}

export async function GET() {
  try {
    const rules = readRules()
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
    const existingRules = readRules()

    // Create a map of existing rules by name for quick lookup
    const existingRulesMap = new Map(existingRules.map((rule) => [rule.name, rule]))

    // Update or add rules
    validatedRules.forEach((rule) => {
      existingRulesMap.set(rule.name, rule)
    })

    // Convert map back to array
    const updatedRules = Array.from(existingRulesMap.values())

    writeRules(updatedRules)
    return NextResponse.json({ message: "Rules saved successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error saving rules:", error)
    return NextResponse.json({ error: "Failed to save rules" }, { status: 500 })
  }
}
