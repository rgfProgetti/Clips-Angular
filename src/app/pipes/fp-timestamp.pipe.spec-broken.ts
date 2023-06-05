import { FpTimestampPipe } from './fp-timestamp.pipe';

describe('FpTimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new FpTimestampPipe();
    expect(pipe).toBeTruthy();
  });
});
