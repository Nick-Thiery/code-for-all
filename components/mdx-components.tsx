import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Callout } from "@/components/callout";
import { Challenge } from "@/components/challenge";
import { CheckYourself, Question } from "@/components/check-yourself";
import { HandsOn } from "@/components/chip";
import { MdxPre } from "@/components/code-block";
import { CommandBlock } from "@/components/command-block";
import { ApiDoorDiagram } from "@/components/diagrams/api-door";
import { BranchLanesDiagram } from "@/components/diagrams/branch-lanes";
import { DirectoryTabsDiagram } from "@/components/diagrams/directory-tabs";
import {
  InstallCodeTabDrawing,
  InstallDownloadDrawing,
  InstallTerminalDrawing,
} from "@/components/diagrams/install-claude-code";
import { LoginDiagram } from "@/components/diagrams/logging-in";
import { ThreeFilesDiagram } from "@/components/diagrams/three-files";
import { VibeCodingDiagram } from "@/components/diagrams/vibe-coding";
import { Figure } from "@/components/figure";
import { KeyTerm } from "@/components/key-term";
import { Placeholder } from "@/components/placeholder";
import { LadderPrompt, PromptLadder, StrongPrompt } from "@/components/prompt-ladder";
import { PromptPractice } from "@/components/prompt-practice";
import { Screenshot } from "@/components/screenshot";
import { StuckBlock, StuckItem } from "@/components/stuck-block";
import { Term } from "@/components/term";
import { VideoEmbed } from "@/components/video-embed";

// Everything here can be used in any lesson without an import.
export const mdxComponents: MDXComponents = {
  // Internal links get client-side navigation.
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} {...props} />,
  // Fenced code blocks.
  pre: MdxPre,
  ApiDoorDiagram,
  BranchLanesDiagram,
  Callout,
  Challenge,
  CheckYourself,
  CommandBlock,
  DirectoryTabsDiagram,
  Figure,
  HandsOn,
  InstallCodeTabDrawing,
  InstallDownloadDrawing,
  InstallTerminalDrawing,
  KeyTerm,
  LadderPrompt,
  LoginDiagram,
  Placeholder,
  PromptLadder,
  PromptPractice,
  Question,
  Screenshot,
  StuckBlock,
  StrongPrompt,
  StuckItem,
  Term,
  ThreeFilesDiagram,
  VibeCodingDiagram,
  VideoEmbed,
};
