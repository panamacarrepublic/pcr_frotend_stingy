import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ComponentType } from "react";

import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import BarChart from "@mui/icons-material/BarChart";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import HelpOutline from "@mui/icons-material/HelpOutline";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import PostAdd from "@mui/icons-material/PostAdd";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import Summarize from "@mui/icons-material/Summarize";

export const NAV_ICONS: Record<string, ComponentType<SvgIconProps>> = {
  Summarize,
  ChatBubbleOutline,
  PostAdd,
  BarChart,
  AccountBalanceWallet,
  NotificationsNone,
  HelpOutline,
  SettingsOutlined,
};
