import ignore, {
  ignoreCode,
  ignoreMessage,
  ignoreName,
  ignoreReason,
  ignoreStatus,
} from '../index'

import BaseError from 'baseerr'
import { ignoreAny } from './../index'

describe('ignoreErrors', () => {
  it('should ignore errors by string matching message', async () => {
    await expect(
      Promise.reject(new Error('boom')).catch(ignoreMessage('boom')),
    ).resolves.toBeNull()
  })

  it('should not ignore errors by string not matching message', async () => {
    await expect(
      Promise.reject(new Error('boom')).catch(ignoreMessage('boom1')),
    ).rejects.toThrow(/boom/)
  })

  it('should ignore errors by regex matching message', async () => {
    await expect(
      Promise.reject(new Error('boom')).catch(ignoreMessage(/boom/)),
    ).resolves.toBeNull()
  })

  it('should ignore errors by key and string matching val', async () => {
    await expect(
      Promise.reject(new Error('boom')).catch(ignore('message', 'boom')),
    ).resolves.toBeNull()
  })

  it('should ignore errors by key and regexp matching val', async () => {
    await expect(
      Promise.reject(new Error('boom')).catch(ignore('message', /boom/)),
    ).resolves.toBeNull()
  })

  it('should ignore errors by object matching message by string', async () => {
    await expect(
      Promise.reject(new Error('boom')).catch(ignore({ message: 'boom' })),
    ).resolves.toBeNull()
  })

  it('should ignore errors by object matching message by regexp', async () => {
    await expect(
      Promise.reject(new Error('boom')).catch(ignore({ message: /boom/ })),
    ).resolves.toBeNull()
  })

  it('should ignore errors by object matching message by multiple matches', async () => {
    await expect(
      Promise.reject(new Error('boom')).catch(
        ignore({ message: 'boom', stack: /./ }),
      ),
    ).resolves.toBeNull()
  })

  it('should ignore errors by string matching name', async () => {
    await expect(
      Promise.reject(new BaseError('boom')).catch(ignoreName('BaseError')),
    ).resolves.toBeNull()
  })

  it('should ignore errors by string matching status', async () => {
    await expect(
      Promise.reject(new BaseError('boom', { status: 500 })).catch(
        ignoreStatus(500),
      ),
    ).resolves.toBeNull()
  })

  it('should ignore errors by string matching reason', async () => {
    await expect(
      Promise.reject(new BaseError('boom', { reason: 'SOMETHING_BAD' })).catch(
        ignoreReason('SOMETHING_BAD'),
      ),
    ).resolves.toBeNull()
  })

  it('should ignore errors by string matching code', async () => {
    await expect(
      Promise.reject(new BaseError('boom', { code: 1 })).catch(ignoreCode(1)),
    ).resolves.toBeNull()
  })

  it('should ignoreAny (pass)', async () => {
    await expect(
      Promise.reject(new BaseError('boom', { code: 1 })).catch(
        ignoreAny(ignoreCode(2), ignoreCode(1)),
      ),
    ).resolves.toBeNull()
  })

  it('should ignoreAny (fail)', async () => {
    await expect(
      Promise.reject(new BaseError('boom', { code: 1 })).catch(
        ignoreAny(ignoreCode(3), ignoreCode(2)),
      ),
    ).rejects.toMatchInlineSnapshot(`[BaseError: boom]`)
  })
})
