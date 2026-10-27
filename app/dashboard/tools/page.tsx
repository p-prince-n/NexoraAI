import ToolList from "@/components/custom/Tools/ToolListData";



const ToolsPage = () => {
  return (
    <div className="w-full flex justify-center  ">
      <div className="max-w-6xl w-full px-6 pt-5 lg:pt-20 pb-16  ">
        <h2 className="font-bold text-3xl dark:text-white ">Integrations</h2>
        <p className="-mt-0.5 text-gray-600 text-xl dark:text-gray-400">
          Connect the tools your agents need to get work done.{" "}
        </p>

        <div className=" mt-5 w-full ">
    <ToolList/>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
