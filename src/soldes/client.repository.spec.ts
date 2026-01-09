import { ClientRepository } from './client.repository';
import type { DbClient } from './client.repository';

describe('ClientRepository', () => {
  describe('findById', () => {
    it('should return null when no row is found', async () => {
      const queryMock = jest.fn().mockResolvedValue([[]]);
      const db: DbClient = { query: queryMock as unknown as DbClient['query'] };

      const repo = new ClientRepository(db);
      await expect(repo.findById('c1')).resolves.toBeNull();
      expect(queryMock).toHaveBeenCalledWith(
        'SELECT id, name FROM clients WHERE id = ?',
        ['c1'],
      );
    });

    it('should return the first row when found', async () => {
      const queryMock = jest
        .fn()
        .mockResolvedValue([[{ id: 'c1', name: 'Alice' }]]);
      const db: DbClient = { query: queryMock as unknown as DbClient['query'] };

      const repo = new ClientRepository(db);
      await expect(repo.findById('c1')).resolves.toEqual({
        id: 'c1',
        name: 'Alice',
      });
    });
  });

  describe('insert', () => {
    it('should call INSERT with placeholders and params', async () => {
      const queryMock = jest.fn().mockResolvedValue([[]]);
      const db: DbClient = { query: queryMock as unknown as DbClient['query'] };

      const repo = new ClientRepository(db);
      await repo.insert({ id: 'c1', name: 'Alice' });

      expect(queryMock).toHaveBeenCalledWith(
        'INSERT INTO clients (id, name) VALUES (?, ?)',
        ['c1', 'Alice'],
      );
    });
  });
});
