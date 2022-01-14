var CryptoJS = require("crypto-js");

$('#btn-encrypt').click(() => {
    var secretKey = $('#key').val();
    var data = $('#data').val();

    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

    $('#result').val(ciphertext);
});

$('#btn-decrypt').click(() => {
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

    $('#result').val(decryptedData);
});