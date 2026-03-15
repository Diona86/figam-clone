"use client";

import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { ReactNode } from "react";

export function Room({children}:{children:ReactNode}){
  return(
    <RoomProvider id="my-room" initialPresence={{}}>
      <ClientSideSuspense fallback={<div>Loading...</div>}>
        {()=>children}
      </ClientSideSuspense>
    </RoomProvider>
  )
}