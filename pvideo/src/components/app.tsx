import { FunctionalComponent, h } from "preact";
import { io, Socket } from "socket.io-client";
import cors from "cors";

import Header from "./header";
import Menu from "./menu/menu";

cors({ origin: "*" });

const App: FunctionalComponent = () => {
  let socket: Socket;
  //let calling: boolean;

  socket = io("localhost:3000");

  const { RTCPeerConnection, RTCSessionDescription } = window;
  const RTCPeerInstance = new RTCPeerConnection();

  //Make a Call
  async function makeCall(id: string) {
    try {
      const call = await RTCPeerInstance.createOffer();
      await RTCPeerInstance.setLocalDescription(
        new RTCSessionDescription(call)
      );

      socket.emit("call", {
        call,
        receiver: id,
      });
    } catch (err) {
      console.log(err);
      alert("Error Occured");
      return;
    }
  }
  makeCall(socket.id);

  //Call Alert to Reeiver, Receiver Request or Decline Awaits
  socket.on("call_alert", async (res) => {
    const confirmed = confirm(
      `UserID ${res.socket_id}" wants to call you. Do accept this call?`
    );

    if (!confirmed) {
      socket.emit("decline", {
        receiver: res.socket_id,
      });
      socket.emit("disconnect");
    }
    await RTCPeerInstance.setRemoteDescription(
      new RTCSessionDescription(res.request_to_call)
    );
    const answer = await RTCPeerInstance.createAnswer();
    await RTCPeerInstance.setLocalDescription(
      new RTCSessionDescription(answer)
    );

    socket.emit("answer", {
      answer,
      receiver: res.socket_id,
    });
  });

  //When Receiver Declined Call
  socket.on("call_rejected", (res) => {
    alert(`UserID: ${res.socket_id}" rejected your call.`);
  });

  //When Receiver Answered Call
  socket.on("answered", async (res) => {
    await RTCPeerInstance.setRemoteDescription(
      new RTCSessionDescription(res.answer)
    );

    makeCall(res.socket_id);
    //calling = true;
  });

  //Caller Video Media Connection
  window.onload = () => {
    let getNavigator: MediaDevices;
    getNavigator = navigator.mediaDevices;
    getNavigator
      .getUserMedia({ video: true, audio: false })
      .then((stream: MediaStream) => {
        let callerVideo = document.querySelector(
          ".caller_video"
        ) as HTMLVideoElement;

        if (callerVideo) {
          callerVideo.srcObject = stream;
        } else {
          console.error(`Cant Find video element`);
        }
        stream
          .getTracks()
          .forEach((track) => RTCPeerInstance.addTrack(track, stream));
      })
      .catch((err) => console.error(err));

    //Receiver Video Connection
    RTCPeerInstance.ontrack = ({ streams }) => {
      let receiverVideo = document.querySelector(
        ".receiver_video"
      ) as HTMLVideoElement;

      if (receiverVideo) {
        receiverVideo.srcObject = streams[0];
      } else {
        console.error(`Cant Find video element`);
      }
    };
  };

  return (
    <div id="preact_root">
      <Header />
      <div className="container">
        {/* <Menu /> */}
        <div className="video">
          <video autoPlay className="receiver_video"></video>
          <video autoPlay className="caller_video"></video>
        </div>
      </div>
    </div>
  );
};

export default App;
