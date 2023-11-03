const { Observable, fromEvent, partition, combineLatest, zip } = rxjs;
const { map, flatMap, take, skip } = rxjs.operators;
const mediaSource = new MediaSource();
const url = URL.createObjectURL(mediaSource);
const segmentSizeInSeconds = 10;
let duration = null;
let interval = null;

const bufferStream = filePath =>
  new Observable(async subscriber => {
    const ffmpeg = FFmpeg.createFFmpeg({ corePath: "js/ffmpeg-core.js", log: false });
    const fileExists = file => ffmpeg.FS("readdir", "/").includes(file);
    const readFile = file => ffmpeg.FS("readFile", file);
    const tempFileName = filePath.substring(filePath.lastIndexOf('/') + 1);

    await ffmpeg.load();
    ffmpeg.FS("writeFile", tempFileName, await FFmpeg.fetchFile(filePath));

    //get duration
    ffmpeg.setLogger(({ type, message }) => {
      if (!duration && message.includes('Duration')) {
        duration = parseDuration(message);
      }
    });
    await ffmpeg.run('-i', tempFileName);
    if (duration) {
      mediaSource.duration = duration;
    }
    ffmpeg.setLogger(({ type, message }) => { });

    let index = 0;

    ffmpeg
      .run(
        "-i",
        tempFileName,
        "-g",
        "1",
        // Encode for MediaStream
        "-segment_format_options",
        "movflags=frag_keyframe+empty_moov+default_base_moof",
        // encode in segments
        "-segment_time",
        "" + segmentSizeInSeconds,
        // write to files by index
        "-f",
        "segment",
        "%d.mp4"
      )
      .then(() => {
        // send out the remaining files
        while (fileExists(`${index}.mp4`)) {
          subscriber.next(readFile(`${index}.mp4`));
          index++;
        }
        subscriber.complete();
        clearInterval(interval);
        interval = setInterval(() => {
          if (canCloseStream(mediaSource)) {
            mediaSource.endOfStream();
            clearInterval(interval);
          }
        }, 200);
      });

    interval = setInterval(() => {
      // periodically check for files that have been written
      if (fileExists(`${index + 1}.mp4`)) {
        subscriber.next(readFile(`${index}.mp4`));
        index++;
      }
    }, 200);
  });

function canCloseStream(mediaSrc) {
  for (let i = 0; i < mediaSrc.activeSourceBuffers.length; i++) {
    if (mediaSrc.activeSourceBuffers[i].updating) {
      return false;
    }
  }
  return true;
}

function parseDuration(msg) {
  const durStr = 'Duration: ';
  let startIndex = msg.indexOf(durStr) + durStr.length;
  let endIndex = msg.indexOf('.');
  let arr = msg.substring(startIndex, endIndex).split(':');
  if (arr.length != 3) {
    return null;
  }
  let seconds = ((+arr[0]) * 60 * 60) + ((+arr[1]) * 60) + (+arr[2]);
  return seconds;
}

function convertAndStream(filePath, mediaEle) {
  mediaEle.src = url;
  player.load(url);
  player.play();

  const mediaSourceOpen = fromEvent(mediaSource, "sourceopen");

  const bufferStreamReady = combineLatest(
    mediaSourceOpen,
    bufferStream(filePath)
  ).pipe(map(([, a]) => a));

  const sourceBufferUpdateEnd = bufferStreamReady.pipe(
    take(1),
    map(buffer => {
      // create a buffer using the correct mime type
      const mime = `video/mp4; codecs="${muxjs.mp4.probe.tracks(buffer).map(t => t.codec).join(",")}"`;
      const sourceBuf = mediaSource.addSourceBuffer(mime);
      if (!duration) {
        mediaSource.duration = segmentSizeInSeconds;
      }
      // append the buffer
      sourceBuf.timestampOffset = 0;
      sourceBuf.appendBuffer(buffer);
      // create a new event stream
      return fromEvent(sourceBuf, "updateend").pipe(map(() => sourceBuf));
    }),
    flatMap(value => value)
  );

  zip(sourceBufferUpdateEnd, bufferStreamReady.pipe(skip(1)))
    .pipe(
      map(([sourceBuf, buffer]) => {
        if (!duration) {
          mediaSource.duration += segmentSizeInSeconds;
        }
        sourceBuf.timestampOffset += segmentSizeInSeconds;
        sourceBuf.appendBuffer(buffer.buffer);
      })
    ).subscribe();
}