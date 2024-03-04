import type { mnemonicToSeedSync as mnemonicToSeedSyncT } from "ethereum-cryptography/bip39";
import type { HDKey as HDKeyT } from "ethereum-cryptography/hdkey";
import * as bip39 from "bip39";
import {derivePath} from "ed25519-hd-key";
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

export function getPrivateKey(mnemonic: string, index: number) {
  const privatKey = deriveKeyFromMnemonicAndPath(
    mnemonic,
    `m/44'/60'/0'/0/${index}`,
    ""
  );
  return privatKey.toString('hex');
}

export async function getSeedSolana(mnemonic: string, index: number) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seedBuffer = Buffer.from(seed).toString('hex');
  const path44Change = `m/44'/501'/${index}'/0'`;
  return derivePath(path44Change, seedBuffer).key;
}

export async function getSeedSuiAddress(mnemonic: string, index: number) {
  const keypair_ed25519 = Ed25519Keypair.deriveKeypair(mnemonic, `m/44'/784'/${index}'/0'/0'`);
  return keypair_ed25519.getPublicKey().toSuiAddress()
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
