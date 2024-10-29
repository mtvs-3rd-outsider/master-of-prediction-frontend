import { RSocketClient, BufferEncoders, MESSAGE_RSOCKET_COMPOSITE_METADATA } from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import { Flowable } from "rsocket-flowable";
import { createMetadata, createSetupMetadata } from "@util/metadataUtils";
import { Message } from "@ui/ChatUI";
interface StreamConfig {
    endpoint: string;
    onNext: (data: any) => void;
  }
  
  interface ChannelConfig {
    sourceRef: React.MutableRefObject<any>; // Retained sourceRef for sending messages
    onNext: (data: any) => void;
  }
  interface RSocketClientSetupConfig {
    clientRef: React.MutableRefObject<any>;
    token: string | undefined;
    channels?: ChannelConfig[]; // 선택적인 channels
    streams?: StreamConfig[]; // 선택적인 streams
  }
export const RSocketClientSetup = {
    init(
       { clientRef,
        token,
        channels,
        streams} // Array of streams
      : RSocketClientSetupConfig) {
        const client = createRSocketClient(token);
    
        // Establish the RSocket connection
        client.connect().then((rsocket) => {
          clientRef.current = rsocket;
    
          // Set up channels
          channels?.forEach(({ sourceRef, onNext }) => {
            setupRequestChannel(rsocket, sourceRef, onNext);
          });
    
          // Set up streams
          streams?.forEach(({ endpoint, onNext }) => {
            setupRequestStream(rsocket, endpoint, token, onNext);
          });
        });
      },
   
      sendMessage(
        sourceRef: React.MutableRefObject<any>,
        message: any, // Message 타입을 인자로 받음
        metadata: any
      ) {
        const payload = createPayload(message); // Message DTO로 payload 생성
        sourceRef?.current.onNext({
          data: payload,
          metadata,
        });
      },
};

// Helper function to create an RSocketClient instance
function createRSocketClient(token: string | undefined) {
  return new RSocketClient({
    transport: new RSocketWebSocketClient(
      {
        url: process.env.NEXT_PUBLIC_RSOCKET_URL!,
      },
      BufferEncoders
    ),
    setup: {
      dataMimeType: "application/json",
      metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.toString(),
      keepAlive: 5000,
      lifetime: 60000,
      payload: {
        data: Buffer.alloc(0),
        metadata: createSetupMetadata( token!),
      },
    },
  });
}

// Helper function to set up a request channel
function setupRequestChannel(rsocket: any, sourceRef: React.MutableRefObject<any>, onNext: (data: any) => void) {
    rsocket
      .requestChannel(
        new Flowable((source) => {
          sourceRef.current = source; // Store reference for sending messages
          source.onSubscribe({
            cancel: () => {},
            request: (n) => {},
          });
        })
      )
      .subscribe({
        onComplete: () => console.log("requestChannel onComplete"),
        onSubscribe: (subscription: any) => {
          subscription.request(1000);
          console.log("requestChannel onSubscribe");
        },
        onError: (error: any) => console.log("requestChannel error: ", error),
        onNext: (payload: any) => {
          const data = parseData(payload);
          onNext(data);
        },
      });
  }
  // Helper function to parse data payload
function parseData(payload: any): any {
    try {
      return JSON.parse(payload.data);
    } catch (error) {
      console.error("JSON parsing error:", error);
      return null;
    }
  }
// Helper function to set up a request stream
function setupRequestStream(
    rsocket: any,
    endpoint: string,  // setupRequestStream에서만 endpoint를 받음
    token: string | undefined,
    onNextMessage?: (message: any) => void
  ) {
    rsocket
      .requestStream({
        metadata: createMetadata(endpoint, token!), // 전달된 endpoint 사용
      })
      .subscribe({
        onComplete: () => console.log("requestStream onComplete"),
        onSubscribe: (subscription:any) => {
          subscription.request(1000);
          console.log("requestStream onSubscribe");
        },
        onError: (error:any) => console.log("requestStream error: ", error),
        onNext: (e: any) => {
          try {
            const message = JSON.parse(e.data);
            console.log("requestStream onNext", message);
            if(onNextMessage)
            {
                onNextMessage(message);
            }
          } catch (error) {
            console.error("JSON parsing error:", error);
          }
        },
      });
  }

// Helper function to create a payload for sending messages
function createPayload(message: any): Buffer {
  return Buffer.from(JSON.stringify(message));
}