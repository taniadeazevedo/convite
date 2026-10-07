import Invitation from "./Invitation";
import { sampleData } from "@/lib/templates";

// Un móvil con una plantilla real dentro, para la landing
export default function TemplatePhone({ template, className = "" }: { template: string; className?: string }) {
  return (
    <div className={`h-[460px] w-[230px] shrink-0 overflow-hidden rounded-[2.2rem] border-[7px] border-ink bg-white shadow-2xl ${className}`}>
      <div className="w-[400px] origin-top-left scale-[0.54]" inert>
        <Invitation template={template} data={sampleData(template)} mode="demo" embedded />
      </div>
    </div>
  );
}
