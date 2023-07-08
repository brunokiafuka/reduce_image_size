const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const FILEPATH = path.resolve(__dirname, "imgs");
const REDUCE_TO_PERCENT = 0.4;
const COMPRESSED_FORMAT = ".jpeg";
const MAX_CHUNK_SIZE = 100;
const OUTER_FILES = '/processed_images/'

async function resizeImage() {
    fs.readdir(FILEPATH, function (err, content) {
        const chunks = splitChunks(content, MAX_CHUNK_SIZE);
        const chunkSize = chunks.length;
        let currChunk = 1;

        for (const chunk of chunks) {
            chunk.map(async (img, idx) => {
                const imagePath = path.join(FILEPATH, img);

                const { width, height } = await sharp(imagePath).metadata();

                await sharp(imagePath)
                    .resize({
                        width: parseInt(width * REDUCE_TO_PERCENT),
                        height: parseInt(height * REDUCE_TO_PERCENT),
                    })
                    .toFormat("jpeg", { mozjpeg: true })
                    .toFile(__dirname + OUTER_FILES + idx + COMPRESSED_FORMAT);
            });

            console.log(`${currChunk}/${chunkSize} == Total: ${chunk.length} Images`);
            currChunk++;
        }
    });
}

const splitChunks = (sourceArray, chunkSize) => {
    const result = [];

    for (let i = 0; i < sourceArray.length; i += chunkSize) {
        result[i / chunkSize] = sourceArray.slice(i, i + chunkSize);
    }
    return result;
};

resizeImage();
