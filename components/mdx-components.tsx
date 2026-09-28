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
import { BranchVsForkDiagram } from "@/components/diagrams/branch-vs-fork";
import { CantCanDiagram } from "@/components/diagrams/cant-can";
import { ChatVsAgentDiagram } from "@/components/diagrams/chat-vs-agent";
import { CodeJourneyDiagram } from "@/components/diagrams/code-journey";
import { ConsoleDrawing } from "@/components/diagrams/console-drawing";
import { CoursePathDiagram } from "@/components/diagrams/course-path";
import { DeployLoopDiagram } from "@/components/diagrams/deploy-loop";
import { EthicsCardsDiagram } from "@/components/diagrams/ethics-cards";
import { ExtensionPartsDiagram } from "@/components/diagrams/extension-parts";
import { FourJobsDiagram } from "@/components/diagrams/four-jobs";
import { GalleryCompareDiagram } from "@/components/diagrams/gallery-compare";
import { PrJourneyDiagram } from "@/components/diagrams/pr-journey";
import { PromptLoopDiagram } from "@/components/diagrams/prompt-loop";
import { PushVsPrDiagram } from "@/components/diagrams/push-vs-pr";
import { RefinePromptDiagram } from "@/components/diagrams/refine-prompt";
import { SkillRecipeDiagram } from "@/components/diagrams/skill-recipe";
import { SprintTimelineDiagram } from "@/components/diagrams/sprint-timeline";
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
import { PublishSafely } from "@/components/publish-safely";
import { SaveHere } from "@/components/save-here";
import { SavedWork } from "@/components/saved-work";
import { Screenshot } from "@/components/screenshot";
import { StuckBlock, StuckItem } from "@/components/stuck-block";
import { TermLookup } from "@/components/term-lookup";
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
  BranchVsForkDiagram,
  CantCanDiagram,
  ChatVsAgentDiagram,
  CodeJourneyDiagram,
  ConsoleDrawing,
  CoursePathDiagram,
  DeployLoopDiagram,
  EthicsCardsDiagram,
  ExtensionPartsDiagram,
  FourJobsDiagram,
  GalleryCompareDiagram,
  PrJourneyDiagram,
  PromptLoopDiagram,
  PushVsPrDiagram,
  RefinePromptDiagram,
  SkillRecipeDiagram,
  SprintTimelineDiagram,
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
  PublishSafely,
  Question,
  SaveHere,
  SavedWork,
  Screenshot,
  StuckBlock,
  StrongPrompt,
  StuckItem,
  // A Term without a def shows the glossary's definition (components/term-lookup.tsx).
  Term: TermLookup,
  ThreeFilesDiagram,
  VibeCodingDiagram,
  VideoEmbed,
};
