import { Users } from "lucide-react"
import React from "react"

export default function UserManagementCardDesign({
  title = "",
  value = "",
  subTitle = "",
  icon = Users,
}) {
  const IconComp = icon
  return (
    <>
    <div className="bg-white rounded-2xl shadow-2xl flex flex-col p-5 gap-6 w-[98%]">
      
      <div className="flex justify-between">
        <span className="font-semibold">{title}</span>
        <div><IconComp size={20} /></div>
      </div>

      <div className="flex flex-col items-start">
        <span className="text-xl font-bold">{value}</span>
        <span className="text-xs">{subTitle}</span>
      </div>

    </div>
    </>
  )
}
