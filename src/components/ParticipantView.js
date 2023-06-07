import { useParticipant } from "@videosdk.live/react-sdk";
import { useMemo, useState } from "react";
import ReactPlayer from "react-player";
import MicOffIcon from "../icons/MicOffIcon";
import { usePubSub } from "@videosdk.live/react-sdk";

export const ParticipantView = (props) => {
  const { webcamStream, webcamOn, displayName, micOn } = useParticipant(
    props.participantId
  );
  const [message, setMessage] = useState(null);
    const handleChatMessage = (msg) => {
      setMessage(msg);
    };
    const { publish } = usePubSub("VIEWER_MESSAGE", {
      onMessageReceived: handleChatMessage,
    });

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  return (
    <div
      className="participant-view"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#1A1C22",
        borderRadius: "10px",
        overflow: "hidden",
      }}
      class="video-cover"
    >
      {webcamOn && webcamStream ? (
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"100%"}
          width={"100%"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      ) : (
        <div
          style={{
            fontSize: "50px",
            color: "#fff",
            border: "1px solid #ccc",
            backgroundColor: "blue",
            height:"50px"
          }}
        >
          <h3> Score card Here1 {message ? message.message: ''}</h3>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: "10px",
          bottom: "10px",
          backgroundColor: "#050A0E",
          color: "#fff",
          padding: "4px",
          borderRadius: "4px",
          alignItems: "center",
          justifyItems: "center",
          display: "flex",
        }}
      >
        <h3>Here</h3>
        <pre>{message}</pre>
        {message &&
           <table style={{ borderCollapse: 'collapse' }}>
           <thead>
             <tr>
               <th style={{ border: '1px solid black', padding: '4px' }}>Team</th>
               {message.message[0].sets.map((set, index) => (
                 <th style={{ border: '1px solid black', padding: '4px' }} key={index}>Set {index + 1}</th>
               ))}
             </tr>
           </thead>
           <tbody>
             {message.message.map((team, index) => (
               <tr key={index}>
                 <td style={{ border: '1px solid black', padding: '4px' }}>{team.name}</td>
                 {team.sets.map((set, setIndex) => (
                   <td style={{ border: '1px solid black', padding: '4px' }} key={setIndex}>{Object.values(set)[0]}</td>
                 ))}
               </tr>
             ))}
           </tbody>
         </table>
        }
        {!micOn && <MicOffIcon fillcolor="#fff" height="18" width="18" />}
      </div>
     
    </div>
  );
};