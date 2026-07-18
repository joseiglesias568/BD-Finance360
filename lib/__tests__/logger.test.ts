import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('outputs structured JSON for info level', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('Test message');

    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0]);
    expect(output.level).toBe('info');
    expect(output.message).toBe('Test message');
    expect(output.timestamp).toBeDefined();
  });

  it('outputs structured JSON for error level', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Error occurred');

    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0]);
    expect(output.level).toBe('error');
    expect(output.message).toBe('Error occurred');
  });

  it('outputs structured JSON for warn level', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('Warning message');

    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0]);
    expect(output.level).toBe('warn');
    expect(output.message).toBe('Warning message');
  });

  it('includes context properties in output', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('With context', { userId: '123', action: 'login' });

    const output = JSON.parse(spy.mock.calls[0][0]);
    expect(output.userId).toBe('123');
    expect(output.action).toBe('login');
    expect(output.level).toBe('info');
    expect(output.message).toBe('With context');
  });

  it('includes ISO timestamp', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const before = new Date().toISOString();
    logger.info('Timestamp check');
    const after = new Date().toISOString();

    const output = JSON.parse(spy.mock.calls[0][0]);
    expect(output.timestamp).toBeDefined();
    expect(output.timestamp >= before).toBe(true);
    expect(output.timestamp <= after).toBe(true);
  });

  it('handles debug level in non-production', () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = 'development';
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    logger.debug('Debug message');

    expect(spy).toHaveBeenCalledOnce();
    const output = JSON.parse(spy.mock.calls[0][0]);
    expect(output.level).toBe('debug');

    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
  });

  it('suppresses debug in production', () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    logger.debug('Should not appear');

    expect(spy).not.toHaveBeenCalled();

    (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
  });

  it('outputs valid JSON string', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('JSON validity test', { nested: { key: 'value' } });

    expect(() => JSON.parse(spy.mock.calls[0][0])).not.toThrow();
  });
});
