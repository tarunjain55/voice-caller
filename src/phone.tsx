import { useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import { USER_STATE } from "./phone.types";
import { numberList, stateColor } from "./constant";
import Timer from "./timer";

const Phone = ({ token }: { token: string }) => {
  //State
  const [userState, setUserState] = useState(USER_STATE.OFFLINE);
  const [phoneNumber, setPhoneNumber] = useState<string>("+918005565860");
  const [connection, setConnection] = useState(null);
  const [callDevice, setDevice] = useState<undefined | Device>();
  console.log(connection, callDevice?.state);

  //Callback
  useEffect(() => {
    init();
  }, [token]);

  //Helpers
  const init = async () => {
    if (token) {
      try {
        console.log("Token connected successfully!!", token);
        const device = new Device(token, {
          logLevel: 1,
          edge: "ashburn",
        });
        device.register();

        setDevice(device);

        device.addListener("connect", (device) => {
          console.log("Connect event listener added .....");
          return device;
        });

        device.on("registered", () => {
          console.log("Agent registered");
          setUserState(USER_STATE.READY);
        });

        device.on("connect", (connection) => {
          console.log("Call connect");
          setConnection(connection);
          setUserState(USER_STATE.ON_CALL);
        });
        device.on("disconnect", () => {
          console.log("Disconnect event");
          setUserState(USER_STATE.READY);
          setConnection(null);
        });

        device.on("incoming", (connection) => {
          setUserState(USER_STATE.INCOMING);
          setConnection(connection);
          connection.on("reject", () => {
            setUserState(USER_STATE.READY);
            setConnection(null);
          });
        });

        return () => {
          device.destroy();
          setDevice(undefined);
          setUserState(USER_STATE.OFFLINE);
        };
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  const handleCall = async () => {
    const temp: Record<string, string> = { To: phoneNumber };
    callDevice?.emit("connect");
    callDevice
      ?.connect({
        params: temp,
        rtcConstraints: {
          audio: true,
        },
      })
      .then((call) => {
        call.on("accept", () => {
          setConnection(connection);
          setUserState(USER_STATE.ON_CALL);
          console.log("call accepted");
        });
        call.on("disconnect", () => {
          console.log("The call has been disconnected.");
          setUserState(USER_STATE.READY);
          setConnection(null);
        });
        call.on("reject", () => {
          console.log("The call was rejected.");
        });
      });
  };

  //Render Element
  return (
    <div className="phone">
      {!token && <div className="loading">Loading...........</div>}
      <div className="user-state">
        <i style={{ color: stateColor[userState] }} className="fas fa-stop"></i>{" "}
        {`Status - > ${userState}`}
      </div>
      <input
        className="number-input"
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
      />
      {userState === USER_STATE.ON_CALL ? (
        <Timer />
      ) : (
        <div className="gird">
          {numberList.map((value) => (
            <div
              key={value}
              className="number"
              onClick={() => {
                if (value === "<<") {
                  setPhoneNumber(
                    phoneNumber.substring(0, phoneNumber.length - 1)
                  );
                } else {
                  setPhoneNumber(phoneNumber + value);
                }
              }}
            >
              {value}
            </div>
          ))}
        </div>
      )}
      <div
        className={`${
          userState === USER_STATE.ON_CALL ? "in-call" : "call"
        } button`}
        onClick={() => handleCall()}
      >
        {userState === USER_STATE.ON_CALL ? (
          <i className="material-icons">call_end</i>
        ) : (
          <i className="material-icons">call</i>
        )}
      </div>
    </div>
  );
};

export default Phone;
