'use client';
import { useState, useEffect } from 'react';
import { Rule, RuleSchema } from '@/lib/types/rule';

export default function Home() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rules
  const fetchRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/rule');
      if (!response.ok) {
        throw new Error('Failed to fetch rules');
      }
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError('Failed to fetch rules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save rules
  const saveRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rules),
      });
      if (!response.ok) {
        throw new Error('Failed to save rules');
      }
      alert('Rules saved successfully');
    } catch (err) {
      setError('Failed to save rules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add sample rule
  const addSampleRule = () => {
    const sampleRule = RuleSchema.parse({
      name: 'Sample Rule',
      baseUrl: 'https://example.com',
      searchUrl: '/search',
      searchSelector: '.search-results li',
      itemTitleSelector: 'h3 a',
      itemIdSelector: 'a[data-id]',
      detailUrl: '/detail/{id}',
      playerUrl: '/play/{id}',
      playerVideoSelector: 'video,iframe',
      videoElementAttribute: 'src',
    });
    setRules([...rules, sampleRule]);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Rule Management</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={addSampleRule}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Sample Rule
          </button>
          <button
            onClick={saveRules}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Rules'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Base URL</th>
                <th className="py-2 px-4 border-b">Search URL</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, index) => (
                <tr key={rule.id || index}>
                  <td className="py-2 px-4 border-b">{rule.name}</td>
                  <td className="py-2 px-4 border-b">{rule.baseUrl}</td>
                  <td className="py-2 px-4 border-b">{rule.searchUrl}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => setRules(rules.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {loading ? 'Loading rules...' : 'No rules found. Add a sample rule to get started.'}
          </div>
        )}
      </div>
    </div>
  );
}