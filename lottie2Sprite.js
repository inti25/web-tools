var FileSaver = require('file-saver');
var JSZip = require("jszip");

let cancelled = false;
let zipContent = null;
const logContainer = document.querySelector("#logs");
const player = document.querySelector("lottie-player");
const btnLoad = document.querySelector("#load");
const btnConvert = document.querySelector("#convert");
const btnConvertPng = document.querySelector("#convertPng");
const inputLottieUrl = document.querySelector("#lottieUrl");

const log = message => {
    const msgElem = document.createElement("p");
    msgElem.innerText = message;
    logContainer.appendChild(msgElem);
    logContainer.scrollTop = logContainer.scrollHeight;
};

const loadAsImage = markup => {
    const img = new Image();
    return new Promise((res, rej) => {
        img.onload = e => res(img);
        img.onerror = rej;
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
    });
};

const convert = async url => {
    cancelled = false;

    log(`Loading ${url}`);

    // Get lottie size
    const lottieDetails = await getLottieDetails(url);

    log(
        `Lottie as width = ${lottieDetails.width}, height = ${
            lottieDetails.height
        }, frames = ${lottieDetails.frames}`
    );

    log(`Set sprite dimensions...`);

    // Load into player
    player.addEventListener("ready", async () => {
        player.stop();
        player.setLooping(false);
        zipContent = null;
        const zip = new JSZip();
        const photoZip = zip.folder("photos");

        for (let f = 1; f <= lottieDetails.frames; f++) {
            if (cancelled) break;

            log(`Rendering frame #${f}...`);
            player.seek(f);
            // await new Promise(resolve => setTimeout(() => resolve(), 1000));

            const svgMarkup = await player.snapshot(false);

            try {
                const svgAsImg = await loadAsImage(svgMarkup);
                photoZip.file(`${f}.svg`, svgMarkup,{base64: false});
                const xOffset = lottieDetails.width * (f - 1);

                ctx.drawImage(svgAsImg, xOffset, 0);
            } catch (e) {}

        }
        zip.generateAsync({type:"blob"}).then(function(content) {
            // see FileSaver.js
            FileSaver.saveAs(content, "sprites_svg.zip");
        });
        log(`Done!`);
    });

    log(`Startng animation...`);
    player.load(url);
};

const getLottieDetails = async url => {
    let json = "";
    if (url.indexOf("{") == 0) {
        json = JSON.parse(url);
    } else {
        const result = await fetch(url);
        json = await result.json();
    }

    console.log("getLottieDetails", {
        height: json.h,
        width: json.w,
        frames: json.op - json.ip
    })

    return {
        height: json.h,
        width: json.w,
        frames: json.op - json.ip
    };
};

const convertPNG = async url => {
    console.log('convertPNG')
    cancelled = false;

    log(`Loading ${url}`);

    // Get lottie size
    const lottieDetails = await getLottieDetails(url);

    log(
        `Lottie as width = ${lottieDetails.width}, height = ${
            lottieDetails.height
        }, frames = ${lottieDetails.frames}`
    );

    log(`Set sprite dimensions...`);

    // Load into player
    player.addEventListener("ready", async () => {
        player.stop();
        player.setLooping(false);
        zipContent = null;
        const zip = new JSZip();
        const photoZip = zip.folder("photos");

        for (let f = 1; f <= lottieDetails.frames; f++) {
            if (cancelled) break;

            log(`Rendering frame #${f}...`);
            player.seek(f);
            // await new Promise(resolve => setTimeout(() => resolve(), 1000));

            const svgMarkup = await player.snapshot(false);

            try {
                const svgAsImg = await loadAsImage(svgMarkup);
                const canTemp = document.createElement('canvas'); // Not shown on page
                canTemp.height = lottieDetails.height;
                canTemp.width = lottieDetails.width;
                const ctxTemp = canTemp.getContext('2d');
                ctxTemp.drawImage(svgAsImg, 0, 0);
                const savable = new Image();
                savable.src = canTemp.toDataURL("image/png");
                photoZip.file(`${f}.png`, savable.src.substr(savable.src.indexOf(',')+1),{base64: true});

            } catch (e) {
                console.log(e);
            }

        }
        zip.generateAsync({type:"blob"}).then(function(content) {
            // see FileSaver.js
            FileSaver.saveAs(content, "sprites_png.zip");
        });
        log(`Done!`);
    });

    log(`Startng animation...`);
    player.load(url);
};

if (btnLoad) {
    btnLoad.addEventListener("click", () => {
        player.load(inputLottieUrl.value);

        cancelled = false;
    });
}

if (btnConvert) {
    btnConvert.addEventListener("click", () => {
        convert(inputLottieUrl.value);
    });
}

if (btnConvertPng) {
    btnConvertPng.addEventListener("click", () => {
        convertPNG(inputLottieUrl.value);
    });
}

