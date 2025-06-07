import SideBar from "./component/SideBar";
import ChatArea from "./component/ChatArea";

const page = () => {
  return (
    <>
      <div className="h-dvh px-10 py-5 bg-blue-400">
        <div className="sm:grid sm:grid-cols-[300px_1fr] h-full sm:gap-5">
          <div>
            <SideBar />
          </div>
          <div>
            <ChatArea />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
