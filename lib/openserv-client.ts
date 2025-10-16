/**
 * OpenServ API Client
 * Handles webhook triggers, task tracking, and agent lifecycle
 */

const OPENSERV_WEBHOOK_URL = 'https://api.openserv.ai/webhooks/trigger/d4b0927a1335453ca7c608b2671e5d3a';

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
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_agent',
          config,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenServ webhook failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        task_id: data.task_id || `task_${Date.now()}`,
        status: data.status || 'pending',
        result: data.result,
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
        },
        body: JSON.stringify({
          action: 'monitor_agent',
          agent_id: agentId,
          config,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
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
        },
        body: JSON.stringify({
          action: 'stop_agent',
          agent_id: agentId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('OpenServ stop error:', error);
      throw error;
    }
  }
}

export const openServClient = new OpenServClient();

