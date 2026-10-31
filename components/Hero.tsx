
import { ArrowRight, Bot, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type Props={
  isScrolled:boolean
}

const colors=["bg-red-500", "bg-blue-500", "bg-green-400"]
const tagData=[
  {id:1, data: "3x", desc: "faster handoffs"},
  {id:2, data: "22/7", desc: "scheduled runs"},
  {id:3, data: "100", desc: "starter credits"}
]
const Hero = ({isScrolled}:Props) => {
  const router=useRouter()
  const navigate=(url:string)=> router.push(url);
  return (
    <div id="home" className={`flex flex-col xl:flex-row px-3 md:px-15 xl:px-5 items-center gap-5  justify-between w-full max-w-400  ${isScrolled? "mt-55": "mt-10"}`}>
      <div className="flex items-center justify-center flex-1/2 w-full  ">
      <div className="flex flex-col items-start justify-center w-full gap-5 ">
        <div className="flex  items-center justify-center gap-3 px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-300 hover:dark:bg-purple-800/40 cursor-pointer rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md ">
          <Bot/>
          <span>Agentic automation for everyday operations</span>
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold dark:text-purple-300" ><span className="dark:text-white" >Nexora AI</span> keeps your agents moving while you work.</h1>
        <p className="text-xl dark:text-purple-400" >Create AI Agents that use tools, follow schedules, run repeatable tasks and report back with the signal your team needs.</p>
        <div className="flex items-center mt-5 gap-5 w-full ">
          <button onClick={()=> navigate("/dashboard/agents")} className="flex gap-3 items-center justify-center px-3 py-2 rounded-xl bg-purple-500 text-white dark:bg-purple-700 hover:dark:bg-purple-900 hover:border dark:border-purple-500 dark:text-purple-300 cursor-pointer hover:scale-110 transition-all duration-500  ">
            Manage Agents <ArrowRight className="size-5" />
          </button>
          <button onClick={()=> navigate("/dashboard/play")} className="flex gap-3 items-center justify-center px-3 py-2 rounded-xl border border-purple-600 text-purple-700 dark:border-purple-400 dark:text-purple-300 cursor-pointer hover:scale-110 transition-all duration-500  ">
            View Run <Play className="size-5" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row px-2 sm:px-0 items-center gap-5 w-full mt-2">
          {tagData.map((item)=>(
            <div key={item.id} className="flex pt-5 pb-2 rounded-xl flex-col items-start justify-center px-3 w-full md:w-45 dark: bg-purple-600/10 border dark:border-purple-600 dark:text-purple-300 hover:scale-110 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-md hover:dark:shadow-purple-500 ">
            <h1 className="text-3xl font-bold" >{item.data}</h1>
            <p className="text-lg font-semibold" >{item.desc}</p>
          </div>
          ))}
          
          
        </div>
      </div>
      </div>
      <div className="flex mt-10 xl:mt-0 flex-1/2 items-center justify-center w-full h-full bg-gray-400 dark:bg-purple-600 rounded-xl shadow-xl">
        <div className="flex flex-col items-start justify-center w-full   ">
          <div className="flex items-center justify-start px-3 lg:px-5  gap-1 py-2 ">
            {colors.map((item)=><div key={item} className={`${item} size-4 rounded-full border border-white dark:border-purple-700`} />)}
          </div>

          <div className="flex items-center justify-center  ">
          <img src={"/dashboard-image.PNG"} alt="image" className=" h-auto object-cover" />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
