import Accordion from "@/components/global/Accordion";
import TextField from "@/components/global/TextField"
export default function Home() {
  return (
    <div className="flex items-center justify-center gap-2 w-full h-screen flex-col">
      <div className="w-3/4">
        <Accordion checked={false} HeaderTitle="Email - Key Messages & Content">
          <h5 className="text-[#160647] font-semibold pb-4">Specify the topic, occasion, event or context for your email.</h5>
          
          <TextField customClass="w-[700px] h-11" placeholder="Please enter the name of your campaign, event or occasion." />
          <TextField customClass="w-[700px] mt-4" placeholder="Create a short introductory paragraph that explains how a hybrid cloud platform helps businesses manage their IT environments more effectively." />
          <TextField customClass="w-[700px] mt-4" placeholder="List the features of a cloud platform that boost performance and streamline operations, highlighting operational efficiency and time-saving benefits." />
          <TextField customClass="w-[700px] mt-4" placeholder="Generate a description of how the platform offers flexibility and control for businesses managing hybrid and multi-cloud environments." />

        </Accordion>
      </div>
    </div>
  );
}
