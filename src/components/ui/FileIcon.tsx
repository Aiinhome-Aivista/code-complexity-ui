import React from 'react';
import { InsertDriveFileOutlined } from "@mui/icons-material";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiPython,
  SiGo,
  SiHtml5,
  SiCss3,
  SiJson,
  SiMarkdown,
  SiRust,
  SiCplusplus,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiGnubash,
  SiDart
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { FaJava } from "react-icons/fa";
import { BsFileText } from "react-icons/bs";

interface FileIconProps {
  fileName: string;
  className?: string; // used for custom width/height/margin overrides
}

export function FileIcon({ fileName, className = "" }: FileIconProps) {
  const ext = fileName.split('.').pop()?.toLowerCase();

  // Make icons slightly smaller: w-3.5 h-3.5 (14px) reduced to 12px for subtle look
  const baseClasses = `w-[10px] h-[10px] flex-shrink-0 ${className}`;

  switch (ext) {
    case 'js':
    case 'cjs':
    case 'mjs':
      return <SiJavascript className={`text-[#F7DF1E] ${baseClasses}`} />;
    case 'ts':
      return <SiTypescript className={`text-[#3178C6] ${baseClasses}`} />;
    case 'jsx':
    case 'tsx':
      return <SiReact className={`text-[#61DAFB] ${baseClasses}`} />;
    case 'py':
      return <SiPython className={`text-[#3776AB] ${baseClasses}`} />;
    case 'go':
      return <SiGo className={`text-[#00ADD8] ${baseClasses}`} />;
    case 'html':
    case 'htm':
      return <SiHtml5 className={`text-[#E34F26] ${baseClasses}`} />;
    case 'css':
      return <SiCss3 className={`text-[#1572B6] ${baseClasses}`} />;
    case 'json':
      return <SiJson className={`text-neutral-700 dark:text-neutral-300 ${baseClasses}`} />;
    case 'md':
      return <SiMarkdown className={`text-neutral-700 dark:text-neutral-300 ${baseClasses}`} />;
    case 'txt':
    case 'log':
    case 'env':
      return <BsFileText className={`text-neutral-500 dark:text-neutral-400 ${baseClasses}`} />;
    case 'rs':
      return <SiRust className={`text-neutral-700 dark:text-[#DEA584] ${baseClasses}`} />;
    case 'cs':
      return <TbBrandCSharp className={`text-[#239120] ${baseClasses}`} />;
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'c':
    case 'h':
    case 'hpp':
      return <SiCplusplus className={`text-[#00599C] ${baseClasses}`} />;
    case 'php':
      return <SiPhp className={`text-[#777BB4] ${baseClasses}`} />;
    case 'rb':
      return <SiRuby className={`text-[#CC342D] ${baseClasses}`} />;
    case 'swift':
      return <SiSwift className={`text-[#F05138] ${baseClasses}`} />;
    case 'kt':
    case 'kts':
      return <SiKotlin className={`text-[#0095D5] ${baseClasses}`} />;
    case 'java':
    case 'jar':
      return <FaJava className={`text-[#5382A1] ${baseClasses}`} />;
    case 'dart':
      return <SiDart className={`text-[#0175C2] ${baseClasses}`} />;
    case 'sh':
    case 'bash':
      return <SiGnubash className={`text-[#4EAA25] ${baseClasses}`} />;
    default:
      return <InsertDriveFileOutlined className={`text-neutral-500 font-bold ${className}`} style={{ fontSize: 12 }} />;
  }
}
