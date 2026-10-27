
import StatsDetailes from "@/components/custom/Plays/StatsDetails";
import StatsTable from "@/components/custom/Plays/StatsTable";

const PlayAgents = () => {
 
  return (
    <div className="w-full flex justify-center  ">
      <div className="max-w-6xl w-full px-6 pt-5 lg:pt-20 pb-16  ">
        <h2 className="font-bold text-3xl dark:text-white ">Agent Runs</h2>
        <p className="mt-1 text-muted-foreground dark:text-gray-400">
          See what your agents are working on and review their results.{" "}
        </p>
        <StatsDetailes />
        <div className="flex flex-col justify-center mt-5 w-full ">
          <h1 className="font-bold text-lg md:text-xl xl:text-2xl " >Recent Run</h1>
          <StatsTable/>

        </div>
      </div>
    </div>
  );
};

export default PlayAgents;
