const express = require('express');
const ytdl = require('ytdl-core');
const fs = require('fs');
const app = express();
const PORT = 3000;

const processVideo = require('./youtube.js')


app.get('/',async (request,response) => {

    const videoURL = request.query.url;

    // download in browser

    if(!videoURL) {
        return response.status(400).send("Please Enter The URL");
    }

    try {

        // get info
    
        const info = await ytdl.getInfo(videoURL)

        // get all quality

        const formatsVideo = await info.formats

        // return response.send(info.formats)

        // encode filename to except any error happen when filename contains characters that are not valid in HTTP

        const encodedTitle = encodeURIComponent(info.videoDetails.title);
                
        // choose format video of video

        // const format = ytdl.chooseFormat(info.formats, { quality: 248 });
        // downloadind audio first

        // 

            // const videoId = videoURL;
            // Get video info from YouTube
            ytdl.getInfo(videoURL).then((info) => {
            // Select audio tag
            const format = ytdl.chooseFormat(info.formats,{quality:"251"});
            // Create a write stream to save the video file
            const outputFilePath = `./audios/${info.videoDetails.title}.mp3`;
            const outputStream = fs.createWriteStream(outputFilePath);
            // Download the video file
            ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
            // When the download is complete, show a message
            outputStream.on('finish', () => {
                console.log(`Finished downloading: ${outputFilePath}`);

                // code to download video and merge it with audio

                const pathVideos = './videos/';

                processVideo(videoURL,`${pathVideos}downloaded-video.mp4`,`./audios/${info.videoDetails.title}.mp3`)


            });
            }).catch((err) => {
            console.error(err);
            });

        response.send('done')

        // send the final video
        
        // response.setHeader('Content-Disposition', `attachment; filename="${encodedTitle}.mp3"`);

        // if you want set header with more payload

        // response.writeHead(200, {
        //     'Content-Disposition': `attachment; filename="${info.videoDetails.title}.mp4"`, // Mask non-ANSI chars
        //     'Content-Transfer-Encoding': 'binary',
        //     'Content-Type': 'application/octet-stream'
        // });

                

        // ytdl(videoURL,{ format }).pipe(response);

        
    } catch (error) {
        console.log(error)
        response.status(500).send("Error downloading video");
    }

})

app.listen(PORT,() => {
    console.log(`Server Run on Port ${PORT}`)
})