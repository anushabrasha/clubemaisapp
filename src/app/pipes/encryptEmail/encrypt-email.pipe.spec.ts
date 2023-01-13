import { EncryptEmailPipe } from './encrypt-email.pipe';

describe('EncryptEmailPipe', () => {
  it('create an instance', () => {
    const pipe = new EncryptEmailPipe();
    expect(pipe).toBeTruthy();
  });
});
