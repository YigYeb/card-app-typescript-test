import { server } from "../src/server"
import Prisma from "../src/db";
import { Entry } from '@prisma/client';

jest.mock("../src/db", () => ({
  entry: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

describe('Fastify API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /get/ should return all entries', async () => {
    const scheduled_for_date = new Date()
    const created_at_date = new Date()
    const mockEntries: Entry[] = [
      { id: '1', title: 'Entry 1', description: 'Description 1', scheduled_for: scheduled_for_date, created_at: created_at_date },
      { id: '2', title: 'Entry 2', description: 'Description 2', scheduled_for: scheduled_for_date, created_at: created_at_date },
    ];

    (Prisma.entry.findMany as jest.Mock).mockResolvedValue(mockEntries);

    const response = await server.inject({
      method: 'GET',
      url: '/get/',
    });

    expect(response.statusCode).toBe(200);

    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          title: 'Entry 1',
          description: 'Description 1',
          created_at: expect.any(String),
          scheduled_for: expect.any(String),
        }),
        expect.objectContaining({
          id: '2',
          title: 'Entry 2',
          description: 'Description 2',
          created_at: expect.any(String),
          scheduled_for: expect.any(String),
        }),
      ])
    );

    expect(new Date(responseBody[0].created_at).toISOString()).toEqual(created_at_date.toISOString());
    expect(new Date(responseBody[0].scheduled_for).toISOString()).toEqual(scheduled_for_date.toISOString());
    expect(new Date(responseBody[1].created_at).toISOString()).toEqual(created_at_date.toISOString());
    expect(new Date(responseBody[1].scheduled_for).toISOString()).toEqual(scheduled_for_date.toISOString());
  });

  test('GET /get/:id should return a specific entry', async () => {
    const scheduled_for_date = new Date()
    const created_at_date = new Date()
    const mockEntry: Entry = { id: '3', title: 'Entry 3', description: 'Description 3', scheduled_for: scheduled_for_date, created_at: created_at_date };

    (Prisma.entry.findUnique as jest.Mock).mockResolvedValue(mockEntry);

    const response = await server.inject({
      method: 'GET',
      url: '/get/3',
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toEqual(expect.objectContaining({
      id: '3',
      title: 'Entry 3',
      description: 'Description 3',
      created_at: expect.any(String),
      scheduled_for: expect.any(String),
    }));

    expect(new Date(responseBody.created_at).toISOString()).toEqual(created_at_date.toISOString());
    expect(new Date(responseBody.scheduled_for).toISOString()).toEqual(scheduled_for_date.toISOString());
    
  });

  test('GET /get/:id should return error code 500 if entry is not found', async () => {
    (Prisma.entry.findUnique as jest.Mock).mockResolvedValue(null);

    const response = await server.inject({
      method: 'GET',
      url: '/get/999',
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({
      msg: 'Error finding entry with id 999',
    });
  });

  test('POST /create/ should create a new entry', async () => {
    const scheduled_for_date = new Date()
    const created_at_date = new Date()
    const newEntry: Entry = { id: '1', title: 'Entry 1', description: 'Description 1', scheduled_for: scheduled_for_date, created_at: created_at_date };

    (Prisma.entry.create as jest.Mock).mockResolvedValue(newEntry);

    const response = await server.inject({
      method: 'POST',
      url: '/create/',
      payload: {
        id: '1',
        title: 'Entry 1',
        description: 'Description 1',
        scheduled_for: scheduled_for_date,
        created_at: created_at_date,
      },
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.payload);

    const receivedCreatedAt = new Date(responseBody.created_at);
    const receivedScheduledFor = new Date(responseBody.scheduled_for);

    expect(receivedCreatedAt.getTime()).toBe(created_at_date.getTime());
    expect(receivedScheduledFor.getTime()).toBe(scheduled_for_date.getTime());

    expect(responseBody).toEqual(expect.objectContaining({
      id: '1',
      title: 'Entry 1',
      description: 'Description 1',
      created_at: expect.any(String),
      scheduled_for: expect.any(String),
    }));
  });

  test('POST /create/ should handle error during entry creation', async () => {
    (Prisma.entry.create as jest.Mock).mockRejectedValue(new Error('Error creating entry'));

    const response = await server.inject({
      method: 'POST',
      url: '/create/',
      payload: { title: 'New Entry' },
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({
      msg: 'Error creating entry',
    });
  });

  test('DELETE /delete/:id should delete an entry', async () => {
    (Prisma.entry.delete as jest.Mock).mockResolvedValue(undefined);

    const response = await server.inject({
      method: 'DELETE',
      url: '/delete/1',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ msg: 'Deleted successfully' });
  });

  test('DELETE /delete/:id should return error if deletion fails', async () => {
    (Prisma.entry.delete as jest.Mock).mockRejectedValue(new Error('Error deleting entry'));

    const response = await server.inject({
      method: 'DELETE',
      url: '/delete/999',
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({
      msg: 'Error deleting entry',
    });
  });

  test('PUT /update/:id should update an entry', async () => {
    const updatedEntry: Entry = { id: '1', title: 'Entry 1', description: 'Description 1', scheduled_for: new Date(), created_at: new Date() };

    (Prisma.entry.update as jest.Mock).mockResolvedValue(updatedEntry);

    const response = await server.inject({
      method: 'PUT',
      url: '/update/1',
      payload: {
        title: 'Updated Entry',
        description: 'Updated Description',
        scheduled_for: new Date(),
        created_at: new Date(),
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ msg: 'Updated successfully' });
  });

  test('PUT /update/:id should return error if update fails', async () => {
    (Prisma.entry.update as jest.Mock).mockRejectedValue(new Error('Error updating'));

    const response = await server.inject({
      method: 'PUT',
      url: '/update/1',
      payload: { title: 'Updated Entry' },
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({
      msg: 'Error updating',
    });
  });
});
