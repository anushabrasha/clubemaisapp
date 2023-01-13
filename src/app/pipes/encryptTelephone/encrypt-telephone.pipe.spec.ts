import { EncryptTelephonePipe } from './encrypt-telephone.pipe';

describe('EncryptTelephonePipe', () => {
  it('create an instance', () => {
    const pipe = new EncryptTelephonePipe();
    expect(pipe).toBeTruthy();
  });
});
