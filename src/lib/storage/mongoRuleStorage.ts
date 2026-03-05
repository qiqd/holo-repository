import { Rule } from '../types/rule';
import { connectToMongoDB } from '../db/mongodb';
import { RuleModel } from '../db/models/rule';

class MongoRuleStorage {
  async getAll(): Promise<Rule[]> {
    try {
      await connectToMongoDB();
      const rules = await RuleModel.find().lean();
      return rules as Rule[];
    } catch (error) {
      console.error('Error getting all rules:', error);
      return [];
    }
  }

  async saveAll(rules: Rule[]): Promise<void> {
    try {
      await connectToMongoDB();
      
      // Process each rule individually
      for (const rule of rules) {
        const updatedRule = {
          ...rule,
          updateAt: new Date().toISOString(),
        };
        
        // Use upsert to update if exists, insert if not
        await RuleModel.findOneAndUpdate(
          { id: rule.id },
          updatedRule,
          { upsert: true }
        );
      }
      
      // Get all existing rule ids
      const existingRules = await RuleModel.find({}, { id: 1 });
      const existingIds = new Set(existingRules.map(rule => rule.id));
      
      // Get current rule ids
      const currentIds = new Set(rules.map(rule => rule.id));
      
      // Delete rules that are no longer present
      for (const existingId of existingIds) {
        if (!currentIds.has(existingId)) {
          await RuleModel.deleteOne({ id: existingId });
        }
      }
    } catch (error) {
      console.error('Error saving rules:', error);
      throw new Error('Failed to save rules');
    }
  }

  async getById(id: string): Promise<Rule | null> {
    try {
      await connectToMongoDB();
      const rule = await RuleModel.findOne({ id }).lean();
      return rule as Rule | null;
    } catch (error) {
      console.error('Error getting rule by id:', error);
      return null;
    }
  }

  async add(rule: Rule): Promise<Rule> {
    try {
      await connectToMongoDB();
      const newRule = {
        ...rule,
        id: rule.id || Date.now().toString(),
        updateAt: new Date().toISOString()
      };
      const savedRule = await RuleModel.create(newRule);
      return savedRule.toObject() as Rule;
    } catch (error) {
      console.error('Error adding rule:', error);
      throw new Error('Failed to add rule');
    }
  }

  async update(rule: Rule): Promise<Rule> {
    try {
      await connectToMongoDB();
      const updatedRule = {
        ...rule,
        updateAt: new Date().toISOString()
      };
      const result = await RuleModel.findOneAndUpdate(
        { id: rule.id },
        updatedRule,
        { new: true, upsert: true }
      );
      return result?.toObject() as Rule;
    } catch (error) {
      console.error('Error updating rule:', error);
      throw new Error('Failed to update rule');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await connectToMongoDB();
      await RuleModel.deleteOne({ id });
    } catch (error) {
      console.error('Error deleting rule:', error);
      throw new Error('Failed to delete rule');
    }
  }

  async clear(): Promise<void> {
    try {
      await connectToMongoDB();
      await RuleModel.deleteMany({});
    } catch (error) {
      console.error('Error clearing rules:', error);
      throw new Error('Failed to clear rules');
    }
  }
}

export const mongoRuleStorage = new MongoRuleStorage();
