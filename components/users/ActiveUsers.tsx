import { useOthers, useSelf } from "@/liveblocks.config";
import { Avatar } from "./Avatar";
import { useMemo } from "react";

const ActiveUsers = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;
  const memoizedUsers=useMemo(()=>{return<div
      className="flex items-center justify-center w-full gap-1 py-1 select-none"
    >
      <div className="flex pl-3 ">
        {currentUser && (
          <Avatar otherStyles="border-[3px] border-primary-green" name={"你"} />
        )}
        {users.slice(0, 3).map(({ connectionId}) => {
          return (
            <Avatar key={connectionId} otherStyles="-ml-3" name={`user-${connectionId}`} />
          );
        })}
        {hasMoreUsers && (
          <div className="flex items-center justify-center border-2 border-white min-w-14 w-14 h-14 -ml-3 rounded-full bg-gray-200 text-gray-700 font-medium">
            +{users.length - 3}
          </div>
        )}
      </div>
    </div>},[users, currentUser, hasMoreUsers])
  return memoizedUsers;
};
export default ActiveUsers;
