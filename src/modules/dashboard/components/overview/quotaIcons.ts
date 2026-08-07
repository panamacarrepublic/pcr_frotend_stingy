import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";

import DirectionsCar from "@mui/icons-material/DirectionsCar";
import Handyman from "@mui/icons-material/Handyman";
import Toys from "@mui/icons-material/Toys";

import type { QuotaCardData } from "@/modules/dashboard/types";

export const QUOTA_ICONS: Record<QuotaCardData["icon"], ComponentType<SvgIconProps>> = {
  toys_and_games: Toys,
  directions_car: DirectionsCar,
  tools_power_drill: Handyman,
};
