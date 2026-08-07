import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

// Placeholder Meta-style infinity glyph. TODO: swap for the official Meta brand SVG.
export default function MetaIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d="M7.5 7C4.8 7 3 9.2 3 12s1.8 5 4.5 5c2 0 3.4-1.6 4.5-3.4C13.1 15.4 14.5 17 16.5 17 19.2 17 21 14.8 21 12s-1.8-5-4.5-5c-2 0-3.4 1.6-4.5 3.4C10.9 8.6 9.5 7 7.5 7Zm0 2c1.1 0 2 1.2 2.8 2.6l.2.4-.2.4C9.5 15.8 8.6 15 7.5 15 6.1 15 5 13.7 5 12s1.1-3 2.5-3Zm9 0c1.4 0 2.5 1.3 2.5 3s-1.1 3-2.5 3c-1.1 0-2-1.2-2.8-2.6l-.2-.4.2-.4C14.5 10.2 15.4 9 16.5 9Z" />
    </SvgIcon>
  );
}
