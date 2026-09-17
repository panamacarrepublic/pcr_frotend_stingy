"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";

import { PANAMA_PROVINCES } from "@/lib/panama";
import MetaIcon from "@/modules/auth/components/MetaIcon";
import RecaptchaPlaceholder from "@/modules/auth/components/RecaptchaPlaceholder";
import SocialLoginButton from "@/modules/auth/components/SocialLoginButton";
import { toSignupPayload } from "@/modules/auth/lib/toSignupPayload";
import { signupSchema, type AccountKind } from "@/modules/auth/schemas";
import { signupMessages } from "@/modules/auth/signupMessages";
import { tokens } from "@/theme/tokens";

import { AccountKindToggle } from "./AccountKindToggle";
import { LogoDropzone } from "./LogoDropzone";
import { SignupField } from "./SignupField";
import { signupVariants } from "./variants";

const m = signupMessages;

/**
 * One flat draft covering both branches, validated against the discriminated
 * union. RHF cannot type a `Control` over a union, and the branch schema strips
 * whatever does not belong to the selected kind, so the fields the user cannot
 * see are simply ignored.
 */
interface SignupDraft {
  kind: AccountKind;
  name: string;
  national_id: string;
  email: string;
  phone: string;
  province: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;
  business_name: string;
  manager_name: string;
  ruc: string;
  address: string;
  description: string;
}

const emptyDraft: SignupDraft = {
  kind: "regular",
  name: "",
  national_id: "",
  email: "",
  phone: "",
  province: "",
  password: "",
  password_confirm: "",
  terms_accepted: false,
  business_name: "",
  manager_name: "",
  ruc: "",
  address: "",
  description: "",
};

interface Props {
  kind: AccountKind;
  onKindChange: (kind: AccountKind) => void;
  onSubmitted: () => void;
}

export function SignupForm({ kind, onKindChange, onSubmitted }: Props) {
  const style = signupVariants[kind];
  const [logo, setLogo] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupDraft>({
    resolver: zodResolver(signupSchema) as unknown as Resolver<SignupDraft>,
    defaultValues: emptyDraft,
    mode: "onTouched",
  });

  const switchKind = (next: AccountKind) => {
    setValue("kind", next);
    onKindChange(next);
  };

  const onSubmit = handleSubmit((draft) => {
    // Parsing again is not redundant: the resolver validated, but only `parse`
    // returns the branch-narrowed value with `phone_prefix` defaulted in.
    const values = signupSchema.parse(draft);
    const payload = toSignupPayload(values);

    // TODO(api): step 1 is `supabase.auth.signUp(payload.credentials)`, step 2
    // writes `payload.user` + `payload.profile` keyed by the returned user id.
    // Until both exist, the console is the endpoint.
    // eslint-disable-next-line no-console
    console.log("[signup] payload listo para enviar", {
      ...payload,
      logo_file: logo ? { name: logo.name, size: logo.size, type: logo.type } : null,
    });

    onSubmitted();
  });

  const isBusiness = kind === "business";

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        <AccountKindToggle value={kind} onChange={switchKind} style={style} />

        {/* Social sign-up is offered on the particular frame only. */}
        {!isBusiness ? (
          <>
            <Stack spacing={1.25}>
              <SocialLoginButton icon={<GoogleIcon />} label={m.social.google} />
              <SocialLoginButton icon={<MetaIcon />} label={m.social.meta} />
              <SocialLoginButton icon={<AppleIcon />} label={m.social.apple} />
            </Stack>
            <Divider sx={{ borderColor: style.divider }} />
          </>
        ) : (
          <Divider sx={{ borderColor: style.divider }} />
        )}

        <Stack spacing={2}>
          {isBusiness ? (
            <>
              <SignupField control={control} name="business_name" label={m.fields.businessName} placeholder={m.placeholders.businessName} style={style} required />
              <SignupField control={control} name="manager_name" label={m.fields.managerName} placeholder={m.placeholders.managerName} style={style} required />
              <LogoDropzone style={style} onChange={setLogo} />
            </>
          ) : (
            <SignupField control={control} name="name" label={m.fields.name} placeholder={m.placeholders.name} style={style} required autoComplete="name" />
          )}

          <SignupField control={control} name="phone" label={m.fields.phone} placeholder={m.placeholders.phone} style={style} required type="tel" autoComplete="tel" />

          <SignupField control={control} name="email" label={m.fields.email} placeholder={isBusiness ? m.placeholders.businessEmail : m.placeholders.email} style={style} required type="email" autoComplete="email" />
          <SignupField control={control} name="national_id" label={m.fields.nationalId} placeholder={m.placeholders.nationalId} style={style} required />

          {isBusiness ? (
            <SignupField control={control} name="ruc" label={m.fields.ruc} placeholder={m.placeholders.ruc} style={style} required />
          ) : null}

          <SignupField control={control} name="province" label={m.fields.province} placeholder={m.placeholders.province} style={style} required options={PANAMA_PROVINCES} />

          {isBusiness ? (
            <>
              <SignupField control={control} name="address" label={m.fields.address} placeholder={m.placeholders.address} style={style} required />
              {/* No asterisk: `business_users.description` is nullable, whatever
                  the Figma label says. */}
              <SignupField control={control} name="description" label={m.fields.description} placeholder={m.placeholders.description} style={style} multiline minRows={4} />
            </>
          ) : null}

          <SignupField control={control} name="password" label={m.fields.password} style={style} required type="password" autoComplete="new-password" hint={m.passwordHint} />
          <SignupField control={control} name="password_confirm" label={m.fields.passwordConfirm} style={style} required type="password" autoComplete="new-password" />
        </Stack>

        <RecaptchaPlaceholder />

        <Controller
          name="terms_accepted"
          control={control}
          render={({ field }) => (
            <Stack direction="row" alignItems="flex-start" spacing={1}>
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                size="small"
                sx={{ p: 0, mt: 0.25, color: style.text, "&.Mui-checked": { color: style.text } }}
                inputProps={{ "aria-label": `${m.terms.prefix}${m.terms.link}` }}
              />
              <Typography variant="body2" sx={{ color: style.text }}>
                {m.terms.prefix}
                <Link href="/terminos" underline="always" sx={{ color: "inherit", fontWeight: 600 }}>
                  {m.terms.link}
                </Link>
              </Typography>
            </Stack>
          )}
        />
        {errors.terms_accepted ? (
          <Alert severity="error">{errors.terms_accepted.message}</Alert>
        ) : null}

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{
            py: 1.25,
            borderRadius: `${tokens.radius.md}px`,
            bgcolor: style.submitBg,
            color: style.submitText,
            "&:hover": { bgcolor: style.submitHoverBg },
          }}
        >
          {isSubmitting ? m.submitting : m.submit}
        </Button>

        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Typography variant="body2" sx={{ color: style.mutedText }}>
            {m.haveAccount}
          </Typography>
          <Link href="/login" underline="hover" sx={{ color: style.text, fontWeight: 600 }}>
            <Typography variant="body2" component="span">
              {m.login}
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
