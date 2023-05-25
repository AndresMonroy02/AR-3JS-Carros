import {loadGLTF, loadAudio, loadVideo} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/targets.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const carModel = await loadGLTF('../../assets/models/car2/scene.gltf');
    carModel.scene.scale.set(0.09, 0.09, 0.09);
    carModel.scene.position.set(0.5, 0.5, 0.5);
    // X-Y-Z    
    // carModel.scene.rotation.set(0, 0, 0);
    carModel.scene.userData.clickable = true

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(carModel.scene);

    const listener = new THREE.AudioListener();
    camera.add(listener);

    // const sound = new THREE.Audio(listener);
    // const audio = await loadAudio('../../assets/sounds/GTR-Sound.mp3');
    // sound.setBuffer(audio);

    // Video
    const video = await loadVideo("../../assets/videos/car2/video.mp4");
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 204/480);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);

    document.body.addEventListener('click', (e) => {
      // normalize to -1 to 1
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREE.Vector2(mouseX, mouseY);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let o = intersects[0].object; 
        while (o.parent && !o.userData.clickable) {
          o = o.parent;
        }
        if (o.userData.clickable) {
          if (o === carModel.scene) {
            sound.play();
          }
        }
      }
    });

    var video_rep = true;
    // document.body.addEventListener('dblclick', (e) => {
    //   if (video_rep) {
    //     video_rep = false;
    //     anchor.group.add(plane);
    //     video.play();
    //   } else {
    //     video_rep = true;
    //     video.pause();
    //   }
    // });

    document.getElementById('btnvideo').addEventListener('click', (e) => {
      console.log("click");
      if (video_rep) {
        video_rep = false;
        anchor.group.add(plane);
        video.play();
      } else {
        video_rep = true;
        video.pause();
      }
    });
    

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});