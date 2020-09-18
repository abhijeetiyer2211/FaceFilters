const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    console.log( resizedDetections[0].landmarks.positions)
    let value = resizedDetections[0].landmarks.positions
    

    if(value !== undefined){
        let diff1 = value[31].x - value[35].x;
        let diff2 = value[31].y - value[35].y;
        let diff3 = value[27].x - value[33].x;
        let diff4 = value[27].y - value[33].y;
        let width = Math.sqrt(diff1 * diff1 + diff2 * diff2)*2;
        let height = Math.sqrt(diff3 * diff3 + diff4 * diff4) *2;
        const image = new Image();
        image.src = 'https://vignette.wikia.nocookie.net/box-critters/images/2/2f/Clown_nose_large.png/revision/latest?cb=20200425190410';    
        canvas.getContext('2d').drawImage(image, value[31].x - width *1.7, value[31].y -height, width*4 , height*2)
        canvas.getContext('2d').beginPath();
        canvas.getContext('2d').stroke();
        // canvas.getContext('2d').rect( value[30].x, value[30].y, 1, 2)
        // for(i=1;i<= 68;i++){
        // canvas.getContext('2d').beginPath();
        // canvas.getContext('2d').rect( value[i].x, value[i].y, 1, 1)
        // canvas.getContext('2d').stroke(); 
        // }
    }
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    // const landmarks = await faceapi.detectFaceLandmarks(video)
    // const nose = landmarks.getNose();
    // console.log(nose);
    // if(nose!= undefined){
    // canvas.getContext('2d').beginPath();
    // canvas.getContext('2d').rect( resizedDetections.nose.x,resizedDetections.nose.y, 50, 50)
    // canvas.getContext('2d').stroke();
    // drawFace(nose);
  }, 90)
})