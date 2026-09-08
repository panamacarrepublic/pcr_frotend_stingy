"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";

import MetaIcon from "@/modules/auth/components/MetaIcon";
import RecaptchaPlaceholder from "@/modules/auth/components/RecaptchaPlaceholder";
import SocialLoginButton from "@/modules/auth/components/SocialLoginButton";
import { loginMessages } from "@/modules/auth/messages";
import { loginSchema, type LoginFormValues } from "@/modules/auth/schemas";
import { supabase } from "@/lib/supabase-client";

const inputSx = {
  bgcolor: "grey.100",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
} as const;

const linkSx = { color: "text.primary", fontWeight: 600 } as const;

export default function LoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Sign in directly against Supabase Auth. On success the session (JWT) is
  // persisted by the Supabase client and picked up by api-client.ts; then we
  // route to the dashboard.
  const onSubmit = handleSubmit(async ({ email, password }) => {
    setSubmitError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setSubmitError(
        error.status === 400
          ? loginMessages.errors.invalidCredentials
          : loginMessages.errors.generic,
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={1.25}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              type="email"
              autoComplete="email"
              placeholder={loginMessages.emailPlaceholder}
              inputProps={{ "aria-label": loginMessages.emailPlaceholder }}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={inputSx}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              size="small"
              type="password"
              autoComplete="current-password"
              placeholder={loginMessages.passwordPlaceholder}
              inputProps={{ "aria-label": loginMessages.passwordPlaceholder }}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={inputSx}
            />
          )}
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox size="small" />}
            label={<Typography variant="body2">{loginMessages.remember}</Typography>}
          />
          <Link href="/forgot-password" underline="hover" sx={linkSx}>
            <Typography variant="body2" component="span">
              {loginMessages.forgot}
            </Typography>
          </Link>
        </Stack>

        <RecaptchaPlaceholder />

        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{ py: 1.25 }}
        >
          {isSubmitting ? loginMessages.submitting : loginMessages.submit}
        </Button>

        <Divider sx={{ my: 1 }} />

        <Stack spacing={1.25}>
          <SocialLoginButton icon={<GoogleIcon />} label={loginMessages.social.google} />
          <SocialLoginButton icon={<MetaIcon />} label={loginMessages.social.meta} />
          <SocialLoginButton icon={<AppleIcon />} label={loginMessages.social.apple} />
        </Stack>

        <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {loginMessages.noAccount}
          </Typography>
          <Link href="/registro" underline="hover" sx={linkSx}>
            <Typography variant="body2" component="span">
              {loginMessages.register}
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
}
