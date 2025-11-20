"use client";

import Link from "next/link";
import { FormField } from "./FormField";
import { FormError } from "./FormError";
import { Button } from "../Button";
import { Turnstile } from "../Turnstile";
import { useContactForm } from "@/hooks/useContactForm";
import { PROPERTY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { publicEnv } from "@/lib/env";

export function ContactForm({ className }: { className?: string }) {
  const {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    submitMessage,
    turnstileResetKey,
    updateField,
    updateTurnstileToken,
    handleBlur,
    submit
  } = useContactForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <FormField
          name="firstname"
          label="Prénom"
          type="text"
          required
          placeholder="Votre prénom"
          value={formData.firstname}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => updateField("firstname", e.target.value)}
          onBlur={() => handleBlur("firstname")}
          error={errors.firstname}
        />

        <FormField
          name="name"
          label="Nom"
          type="text"
          required
          placeholder="Votre nom"
          value={formData.name}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => updateField("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          error={errors.name}
        />

        <FormField
          name="email"
          label="Email"
          type="email"
          required
          placeholder="votre@email.com"
          value={formData.email}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => updateField("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
        />

        <FormField
          name="phone"
          label="Téléphone"
          type="tel"
          required
          placeholder="+32 XXX XX XX XX"
          value={formData.phone}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => updateField("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          error={errors.phone}
        />

        <FormField
          name="company"
          label="Entreprise"
          type="text"
          placeholder="Nom de votre entreprise"
          value={formData.company}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => updateField("company", e.target.value)}
          onBlur={() => handleBlur("company")}
          error={errors.company}
        />

        <FormField
          name="vatNumber"
          label="TVA"
          type="text"
          placeholder="Votre numéro de TVA"
          value={formData.vatNumber}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => updateField("vatNumber", e.target.value)}
          onBlur={() => handleBlur("vatNumber")}
          error={errors.vatNumber}
        />

        <FormField
          name="propertyType"
          label="Vos besoins"
          type="select"
          placeholder="Sélectionnez un type"
          value={formData.propertyType}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => updateField("propertyType", e.target.value)}
          onBlur={() => handleBlur("propertyType")}
          options={PROPERTY_TYPES}
          error={errors.propertyType}
        />

        <FormField
          name="message"
          label="Message"
          type="textarea"
          required
          placeholder="Décrivez votre projet..."
          value={formData.message}
          onChange={(
            e: React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >
          ) => updateField("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          error={errors.message}
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          checked={formData.consent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateField("consent", e.target.checked)
          }
          onBlur={() => handleBlur("consent")}
          className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="consent" className="ml-2 text-sm text-gray-700">
          J&apos;accepte la{" "}
          <Link
            href="/privacy"
            className="text-primary underline hover:text-primary/80"
          >
            politique de confidentialité
          </Link>
          <span className="text-red-500 ml-1">*</span>
        </label>
      </div>
      {errors.consent && (
        <p className="text-sm text-red-500">{errors.consent}</p>
      )}

      <div>
        <Turnstile
          siteKey={publicEnv.turnstile.siteKey}
          resetKey={turnstileResetKey}
          onSuccess={updateTurnstileToken}
          onError={() => {
            // Handle error if needed
          }}
          onExpire={() => {
            updateTurnstileToken("");
          }}
        />
        {errors.turnstileToken && (
          <p className="text-sm text-red-500 mt-2">{errors.turnstileToken}</p>
        )}
      </div>

      {submitStatus === "error" && <FormError message={submitMessage} />}
      {submitStatus === "success" && (
        <div className="p-4 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">{submitMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting || !formData.turnstileToken}
        className="w-full"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer"}
      </Button>
    </form>
  );
}
