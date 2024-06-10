const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// YouTube video URL
const videoURL = 'https://www.youtube.com/watch?v=Pnmvr1vUFH8';
// Paths to save downloaded video and final output
const videoPath = path.join(__dirname, 'downloaded-video.mp4');
const audioPath = path.join(__dirname, './test/audio.mp3');
const outputPath = path.join(__dirname, './youtube-videos/output-video-with-audio.mp4');

// Function to download YouTube video
const downloadVideo = async (url, outputPath) => {
  return new Promise((resolve, reject) => {
    ytdl(url, { quality: 'highestvideo' })
      .pipe(fs.createWriteStream(outputPath))
      .on('finish', resolve)
      .on('error', reject);
  });
};

// Function to merge video and audio
const mergeAudioVideo = (videoPath, audioPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .input(audioPath)
      .outputOptions('-c:v copy') // Copy the video codec to avoid re-encoding
      .outputOptions('-c:a aac') // Set audio codec to AAC
      .outputOptions('-map 0:v:0') // Map the video stream
      .outputOptions('-map 1:a:0') // Map the audio stream
      .save(outputPath)
      .on('start', (commandLine) => {
        console.log('Spawned FFmpeg with command: ' + commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('end', resolve)
      .on('error', (err, stdout, stderr) => {
        console.error('Error: ' + err.message);
        console.error('ffmpeg stdout: ' + stdout);
        console.error('ffmpeg stderr: ' + stderr);
        reject(err);
      });
  });
};

// Main function to download video and merge with audio
const processVideo = async (videoURL,videoPath,audioPath) => {

  try {
    console.log('Downloading video...');
    await downloadVideo(videoURL, videoPath);
    console.log('Video downloaded. Merging with audio...');
    await mergeAudioVideo(videoPath, audioPath, outputPath);
    console.log('Video and audio merged successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

module.exports = processVideo