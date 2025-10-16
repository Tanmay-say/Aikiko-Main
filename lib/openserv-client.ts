/**
 * OpenServ API Client
 * Handles webhook triggers, task tracking, and agent lifecycle
 */

const OPENSERV_WEBHOOK_URL = process.env.NEXT_PUBLIC_OPENSERV_WEBHOOK_URL || 'https://api.openserv.ai/webhooks/trigger/d4b0927a1335453ca7c608b2671e5d3a';
const OPENSERV_API_KEY = process.env.NEXT_PUBLIC_OPENSERV_API_KEY || '';
const OPENSERV_AGENT_ID = process.env.NEXT_PUBLIC_OPENSERV_AGENT_ID || '';

export interface OpenServAgentConfig {
  type: 'social' | 'web' | 'subject';
  provider?: string;
  handle?: string;
  url?: string;
  subject?: string;
  channels?: string[];
  timeframe?: string;
  keywords?: string[];
  notificationCriteria?: string;
}

export interface OpenServTaskResponse {
  task_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: string;
}

export class OpenServClient {
  private webhookUrl: string;

  constructor(webhookUrl = OPENSERV_WEBHOOK_URL) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Trigger agent creation workflow via OpenServ webhook
   */
  async createAgent(config: OpenServAgentConfig): Promise<OpenServTaskResponse> {
    if (!OPENSERV_API_KEY || !OPENSERV_AGENT_ID) {
      console.warn('OpenServ credentials missing. Add NEXT_PUBLIC_OPENSERV_API_KEY and NEXT_PUBLIC_OPENSERV_AGENT_ID to .env.local');
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENSERV_API_KEY}`,
          'X-Agent-ID': OPENSERV_AGENT_ID,
        },
        body: JSON.stringify({
          action: 'create_agent',
          agent_id: OPENSERV_AGENT_ID,
          config,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenServ error:', errorText);
        throw new Error(`OpenServ webhook failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        task_id: data.task_id || data.id || `task_${Date.now()}`,
        status: data.status || 'pending',
        result: data.result || data.data,
        created_at: data.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('OpenServ webhook error:', error);
      throw error;
    }
  }

  /**
   * Monitor agent activity
   */
  async monitorAgent(agentId: string, config: OpenServAgentConfig): Promise<OpenServTaskResponse> {
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENSERV_API_KEY}`,
          'X-Agent-ID': OPENSERV_AGENT_ID,
        },
        body: JSON.stringify({
          action: 'monitor_agent',
          agent_id: OPENSERV_AGENT_ID,
          user_agent_id: agentId,
          config,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenServ monitor error:', errorText);
        throw new Error(`OpenServ monitor failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenServ monitor error:', error);
      throw error;
    }
  }

  /**
   * Get task status
   */
  async getTaskStatus(taskId: string): Promise<OpenServTaskResponse> {
    // In a real OpenServ implementation, this would query a status endpoint
    // For now, return a mock response
    return {
      task_id: taskId,
      status: 'completed',
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Stop monitoring agent
   */
  async stopAgent(agentId: string): Promise<void> {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENSERV_API_KEY}`,
          'X-Agent-ID': OPENSERV_AGENT_ID,
        },
        body: JSON.stringify({
          action: 'stop_agent',
          agent_id: OPENSERV_AGENT_ID,
          user_agent_id: agentId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('OpenServ stop error:', error);
      throw error;
    }
  }

  /**
   * Validate credentials are configured
   */
  isConfigured(): boolean {
    return Boolean(OPENSERV_API_KEY && OPENSERV_AGENT_ID);
  }

  /**
   * Get configuration status for debugging
   */
  getConfig() {
    return {
      webhookUrl: this.webhookUrl,
      hasApiKey: Boolean(OPENSERV_API_KEY),
      hasAgentId: Boolean(OPENSERV_AGENT_ID),
      agentId: OPENSERV_AGENT_ID ? `${OPENSERV_AGENT_ID.substring(0, 8)}...` : 'not set',
    };
  }
}

export const openServClient = new OpenServClient();

