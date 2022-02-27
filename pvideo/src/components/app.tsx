import { FunctionalComponent, h } from "preact";

import Header from "./header";
import Menu from "./menu/menu";

const App: FunctionalComponent = () => {
  window.onload = () => {
    let getNavigator: MediaDevices;
    getNavigator = navigator.mediaDevices;
    getNavigator
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaProvider) => {
        let callerVideo = document.querySelector(
          ".caller_video"
        ) as HTMLVideoElement;

        if (callerVideo) {
          callerVideo.srcObject = stream;
        } else {
          console.error(`Cant Find video element`);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div id="preact_root">
      <Header />
      <div className="container">
        <Menu />
        <div className="video">
          <video autoPlay className="receiver_video"></video>
          <video autoPlay className="caller_video"></video>
        </div>
      </div>
    </div>
  );
};

export default App;
