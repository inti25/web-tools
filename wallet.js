import {Keypair} from "@solana/web3.js";

var CryptoJS = require("crypto-js");
import {ethers, Wallet} from "ethers";
const {getPrivateKey} = require("./util/walletUtil");
import {getSeedSolana, getSeedSuiAddress} from "./util/walletUtil";


$('#btn-ether').click(async () => {
    var secretKey = $('#key').val();
    var ciphertext = $('#data').val();

    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(ciphertext, secretKey);
    var decryptedData = "";
    try {
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
        for (let i = 0; i < 5; i ++) {
            decryptedData += (Math.random() + 1).toString(36).substring(2);
        }
    }

    const privateKey1 = getPrivateKey(decryptedData, 0);
    const wallet1 = new Wallet(privateKey1);

    const privateKey2 = getPrivateKey(decryptedData, 1);
    const wallet2 = new Wallet(privateKey2);

    const privateKey3 = getPrivateKey(decryptedData, 2);
    const wallet3 = new Wallet(privateKey3);
    const str = `${await wallet1.getAddress()}\n${await wallet2.getAddress()}\n${await wallet3.getAddress()}`

    $('#result').val(str);
});

$('#btn-solana').click(async () => {
    var secretKey = $('#key').val();
    var ciphertext = $('#data').val();

    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(ciphertext, secretKey);
    var decryptedData = "";
    try {
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
        for (let i = 0; i < 5; i ++) {
            decryptedData += (Math.random() + 1).toString(36).substring(2);
        }
    }

    const keypair = Keypair.fromSeed(await getSeedSolana(decryptedData, 0))
    const keypair2 = Keypair.fromSeed(await getSeedSolana(decryptedData, 1))
    const keypair3 = Keypair.fromSeed(await getSeedSolana(decryptedData, 2))

    const str = `${keypair.publicKey.toString()}\n${keypair2.publicKey.toString()}\n${keypair3.publicKey.toString()}`

    $('#result').val(str);
});

$('#btn-sui').click(async () => {
    var secretKey = $('#key').val();
    var ciphertext = $('#data').val();

    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(ciphertext, secretKey);
    var decryptedData = "";
    try {
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
        for (let i = 0; i < 5; i ++) {
            decryptedData += (Math.random() + 1).toString(36).substring(2);
        }
    }

    // const keypair = Keypair.fromSeed(await getSeedSolana(decryptedData, 0))
    // const keypair2 = Keypair.fromSeed(await getSeedSolana(decryptedData, 1))
    // const keypair3 = Keypair.fromSeed(await getSeedSolana(decryptedData, 2))
    //
    // const str = `${keypair.publicKey.toString()}\n${keypair2.publicKey.toString()}\n${keypair3.publicKey.toString()}`
    const str = `${await  getSeedSuiAddress(decryptedData, 0)}\n${await  getSeedSuiAddress(decryptedData, 1)}\n${await  getSeedSuiAddress(decryptedData, 2)}`
    $('#result').val(str);
});