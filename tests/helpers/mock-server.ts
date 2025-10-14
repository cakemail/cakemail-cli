import express, { Express } from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';

/**
 * Create a mock Cakemail API server for testing
 *
 * This is a REAL HTTP server that runs on localhost.
 * The CLI subprocess can make real HTTP requests to it.
 */
export function createMockAPI(): Express {
  const app = express();
  app.use(express.json());

  // OAuth2 Authentication
  app.post('/token', (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
      res.json({
        access_token: 'mock-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        scope: 'read write'
      });
    } else {
      res.status(401).json({
        error: 'invalid_grant',
        error_description: 'Invalid credentials'
      });
    }
  });

  // Campaigns
  app.get('/campaigns', (req, res) => {
    res.json({
      data: [
        { id: 1, name: 'Test Campaign 1', status: 'draft', created_on: '2025-01-01' },
        { id: 2, name: 'Test Campaign 2', status: 'sent', created_on: '2025-01-02' }
      ],
      count: 2,
      _links: {}
    });
  });

  app.get('/campaigns/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id === 999) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json({
      id,
      name: `Campaign ${id}`,
      status: 'draft',
      list_id: 1,
      sender_id: 1,
      created_on: '2025-01-01T00:00:00Z'
    });
  });

  app.post('/campaigns', (req, res) => {
    const { name, list_id, sender_id } = req.body;
    if (!name) {
      return res.status(422).json({ error: 'Name is required' });
    }
    res.status(201).json({
      id: 123,
      name,
      list_id,
      sender_id,
      status: 'draft',
      created_on: new Date().toISOString()
    });
  });

  app.patch('/campaigns/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({
      id,
      ...req.body,
      updated_on: new Date().toISOString()
    });
  });

  app.delete('/campaigns/:id', (req, res) => {
    res.status(204).send();
  });

  // Lists
  app.get('/lists', (req, res) => {
    res.json({
      data: [
        { id: 1, name: 'Main List', status: 'active', active_contacts: 100 },
        { id: 2, name: 'VIP List', status: 'active', active_contacts: 25 }
      ],
      count: 2
    });
  });

  app.get('/lists/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({
      id,
      name: `List ${id}`,
      status: 'active',
      active_contacts: 100,
      created_on: '2025-01-01T00:00:00Z'
    });
  });

  app.post('/lists', (req, res) => {
    const { name } = req.body;
    res.status(201).json({
      id: 456,
      name,
      status: 'active',
      created_on: new Date().toISOString()
    });
  });

  app.patch('/lists/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({ id, ...req.body });
  });

  app.delete('/lists/:id', (req, res) => {
    res.status(204).send();
  });

  // Contacts
  app.get('/contacts', (req, res) => {
    res.json({
      data: [
        { id: 1, email: 'user1@example.com', status: 'active' },
        { id: 2, email: 'user2@example.com', status: 'active' }
      ],
      count: 2
    });
  });

  app.get('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({
      id,
      email: `user${id}@example.com`,
      first_name: 'Test',
      last_name: 'User',
      status: 'active'
    });
  });

  app.post('/contacts', (req, res) => {
    const { email, list_ids } = req.body;
    res.status(201).json({
      id: 789,
      email,
      list_ids,
      status: 'active',
      created_on: new Date().toISOString()
    });
  });

  app.patch('/contacts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({ id, ...req.body });
  });

  app.delete('/contacts/:id', (req, res) => {
    res.status(204).send();
  });

  // Senders
  app.get('/senders', (req, res) => {
    res.json({
      data: [
        { id: 1, name: 'Support', email: 'support@example.com', confirmed: true },
        { id: 2, name: 'Marketing', email: 'marketing@example.com', confirmed: false }
      ],
      count: 2
    });
  });

  app.get('/senders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({
      id,
      name: `Sender ${id}`,
      email: `sender${id}@example.com`,
      confirmed: true
    });
  });

  app.post('/senders', (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({
      id: 999,
      name,
      email,
      confirmed: false,
      created_on: new Date().toISOString()
    });
  });

  app.patch('/senders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({ id, ...req.body });
  });

  app.delete('/senders/:id', (req, res) => {
    res.status(204).send();
  });

  // Templates
  app.get('/templates', (req, res) => {
    res.json({
      data: [
        { id: 1, name: 'Welcome Email', tags: ['onboarding'] },
        { id: 2, name: 'Newsletter', tags: ['marketing'] }
      ],
      count: 2
    });
  });

  app.get('/templates/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({
      id,
      name: `Template ${id}`,
      html: '<h1>Hello</h1>',
      text: 'Hello',
      subject: 'Test Subject'
    });
  });

  app.post('/templates', (req, res) => {
    const { name } = req.body;
    res.status(201).json({
      id: 888,
      name,
      created_on: new Date().toISOString()
    });
  });

  app.patch('/templates/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json({ id, ...req.body });
  });

  app.delete('/templates/:id', (req, res) => {
    res.status(204).send();
  });

  return app;
}

/**
 * Start mock server on random available port
 */
export async function startMockServer(): Promise<{ server: Server; port: number; url: string }> {
  const app = createMockAPI();

  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = (server.address() as AddressInfo).port;
      const url = `http://localhost:${port}`;
      resolve({ server, port, url });
    });
  });
}

/**
 * Stop mock server
 */
export async function stopMockServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
