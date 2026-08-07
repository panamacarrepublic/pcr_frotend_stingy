"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { FormProvider, useForm, type DefaultValues } from "react-hook-form";

import { totalSteps, wizardSteps, type WizardStepMeta } from "../lib/stepRegistry";
import { toListingCreatePayload, type ListingCreatePayload } from "../lib/toListingCreatePayload";
import { listingErrorMap } from "../schemas/errorMap";
import {
  publishListingSchema,
  type PublishListingForm,
  type PublishListingInput,
} from "../schemas/listing.schema";

export type WizardVariant = "particular" | "business";
export type UploadMethod = "manual" | "bulk";

const DRAFT_KEY = "pcr:listing-draft";

// Field values while editing are the zod *input* shape (numbers arrive as text,
// selects start empty). Empty required fields become errors on validate.
const defaultValues: DefaultValues<PublishListingInput> = {
  title: "",
  description: "",
  professional_photos: false,
  terms_accepted: undefined,
  photos: [],
  data: {
    category: "cars",
    price: "",
    vin_number: "",
    make_id: "",
    model_id: "",
    model_text: "",
    mileage: "",
    year: "",
    vehicle_type: undefined,
    fuel_type: undefined,
    condition: undefined,
    transmission_type: undefined,
    province: undefined,
    district: "",
  },
};

interface WizardState {
  index: number;
}
type WizardAction = { type: "next" } | { type: "back" } | { type: "goto"; index: number };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "next":
      return { index: Math.min(state.index + 1, totalSteps - 1) };
    case "back":
      return { index: Math.max(state.index - 1, 0) };
    case "goto":
      return { index: Math.min(Math.max(action.index, 0), totalSteps - 1) };
    default:
      return state;
  }
}

interface WizardContextValue {
  variant: WizardVariant;
  stepIndex: number;
  step: WizardStepMeta;
  isFirst: boolean;
  isLast: boolean;
  submitting: boolean;
  /** Validate the current step's fields; advance only if they pass. */
  goNext: () => Promise<void>;
  goBack: () => void;
  gotoStep: (index: number) => void;
  saveDraft: () => void;
  /** Run full validation then hand the mapped payload to the onSubmit prop. */
  submit: () => void;
  /** Ask the host (dialog) to close — it owns any discard confirmation. */
  requestClose: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function usePublishWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("usePublishWizard must be used within a PublishWizardProvider");
  return ctx;
}

interface PublishWizardProviderProps {
  variant?: WizardVariant;
  onSubmit: (payload: ListingCreatePayload) => Promise<void> | void;
  onRequestClose?: () => void;
  children: ReactNode;
}

export function PublishWizardProvider({
  variant = "particular",
  onSubmit,
  onRequestClose,
  children,
}: PublishWizardProviderProps) {
  const form = useForm<PublishListingForm>({
    resolver: zodResolver(publishListingSchema, { errorMap: listingErrorMap }),
    // Field values start as the zod *input* shape (strings, empty selects); the
    // resolver coerces to the output shape on validate. Cast bridges the two.
    defaultValues: defaultValues as unknown as DefaultValues<PublishListingForm>,
    mode: "onTouched",
  });
  const [state, dispatch] = useReducer(wizardReducer, { index: 0 });
  const step = wizardSteps[state.index];

  const goNext = useCallback(async () => {
    const ok = step.fields.length === 0 ? true : await form.trigger(step.fields);
    if (ok) dispatch({ type: "next" });
  }, [form, step]);

  const goBack = useCallback(() => dispatch({ type: "back" }), []);
  const gotoStep = useCallback((index: number) => dispatch({ type: "goto", index }), []);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form.getValues()));
    } catch {
      // localStorage may be unavailable (private mode) — draft is best-effort.
    }
  }, [form]);

  const submit = useMemo(
    () =>
      form.handleSubmit(async (data) => {
        await onSubmit(toListingCreatePayload(data));
      }),
    [form, onSubmit],
  );

  const value: WizardContextValue = {
    variant,
    stepIndex: state.index,
    step,
    isFirst: state.index === 0,
    isLast: state.index === totalSteps - 1,
    submitting: form.formState.isSubmitting,
    goNext,
    goBack,
    gotoStep,
    saveDraft,
    submit,
    requestClose: () => onRequestClose?.(),
  };

  return (
    <FormProvider {...form}>
      <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
    </FormProvider>
  );
}
