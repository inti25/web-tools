import type { mnemonicToSeedSync as mnemonicToSeedSyncT } from "ethereum-cryptography/bip39";
import type { HDKey as HDKeyT } from "ethereum-cryptography/hdkey";
import * as bip39 from "bip39";
import {derivePath} from "ed25519-hd-key";

const { bufferToHex } = require("@nomicfoundation/ethereumjs-util");


export function getPrivateKey(mnemonic: string, index: number) {
  const privatKey = deriveKeyFromMnemonicAndPath(
    mnemonic,
    `m/44'/60'/0'/0/${index}`,
    ""
  );

  return bufferToHex(<Buffer>privatKey);
}

export async function getSeedSolana(mnemonic: string, index: number) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seedBuffer = Buffer.from(seed).toString('hex');
  const path44Change = `m/44'/501'/${index}'/0'`;
  return derivePath(path44Change, seedBuffer).key;
}

export function deriveKeyFromMnemonicAndPath(
  mnemonic: string,
  hdPath: string,
  passphrase: string
): Buffer | undefined {
  const {
    mnemonicToSeedSync,
  }: {
    mnemonicToSeedSync: typeof mnemonicToSeedSyncT;
  } = require("ethereum-cryptography/bip39");
  const trimmedMnemonic = mnemonic.trim();
  const seed = mnemonicToSeedSync(trimmedMnemonic, passphrase);
  const {
    HDKey,
  }: {
    HDKey: typeof HDKeyT;
  } = require("ethereum-cryptography/hdkey");
  const masterKey = HDKey.fromMasterSeed(seed);
  const derived = masterKey.derive(hdPath);

  return derived.privateKey === null
    ? undefined
    : Buffer.from(derived.privateKey);
}
