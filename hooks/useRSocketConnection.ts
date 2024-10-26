import { RSocketClient, BufferEncoders, MESSAGE_RSOCKET_COMPOSITE_METADATA } from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
import { Flowable } from "rsocket-flowable";
import { createMetadata, createSetupMetadata } from "@util/metadataUtils";

export const RSocketClientSetup = {
  init(
    clientRef: React.MutableRefObject<any>,
    sourceRef: React.MutableRefObject<any>,
    roomId: string,
    token: string | undefined,
    userId: String,
    onNextMessage: (message: any) => void
  ) {
    const client = createRSocketClient(token);

    // Establish the RSocket connection
    client.connect().then((rsocket) => {
      clientRef.current = rsocket;
      setupRequestChannel(rsocket, sourceRef);
      setupRequestStream(rsocket, `api.v1.messages.stream/${roomId}`, token, onNextMessage); 
      setupRequestStream(rsocket, `api.v1.messages.connect/${roomId}`, token); 
    
    });
  },

  sendMessage(
    sourceRef: React.MutableRefObject<any>,
    content: string,
    metadata: any,
    user: any,
    roomId: string
  ) {

    const payload = createPayload(content, user, roomId);
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
function setupRequestChannel(rsocket: any, sourceRef: React.MutableRefObject<any>) {
  rsocket
    .requestChannel(
      new Flowable((source) => {
        sourceRef.current = source;
        source.onSubscribe({
          cancel: () => {},
          request: (n) => {},
        });
      })
    )
    .subscribe({
      onComplete: () => console.log("requestChannel onComplete"),
      onSubscribe: (subscription:any) => {
        subscription.request(1000);
        console.log("requestChannel onSubscribe");
      },
      onError: (error:any) => console.log("requestChannel error: ", error),
      onNext: (payload:any) => console.log("requestChannel onNext:", payload),
    });
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
function createPayload(content: string, user: any, roomId: string): Buffer {
  return Buffer.from(
    JSON.stringify({
      content,
      user,
      sent: new Date().toISOString(),
      roomId,
      replyToMessageId: null,
      contentType: "PLAIN",
    })
  );
}
