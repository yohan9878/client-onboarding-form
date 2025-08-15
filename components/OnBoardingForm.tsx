"use client";

import { OnboardFormData, OnboardSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Inputs = z.infer<typeof OnboardSchema>;

// Define allowed services as const tuple (type-safe)
const allowedServices = ["UI/UX", "Branding", "Web Dev", "Mobile App"] as const;
type ServiceType = typeof allowedServices[number];

export default function OnBoardingForm() {
  const [data, setData] = useState<Inputs>();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(OnboardSchema),
    defaultValues: {
      services: [],
      acceptTerms: false,
    },
  });

  // Pre-fill services from URL params if valid
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get("service");

    if (serviceParam && allowedServices.includes(serviceParam as ServiceType)) {
      setValue("services", [serviceParam as ServiceType]);
    }
  }, [setValue]);

  const onSubmit = async (formData: OnboardFormData) => {
    setData(formData);
    reset();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_ONBOARD_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      setSuccessMsg(
        `Form submitted successfully! Thank you, ${formData.fullName}.`
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Network error");
    }
  };

  const services: readonly ServiceType[] = allowedServices;
  const selectedServices = watch("services");

  return (
    <section className="flex gap-6 p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-2 mt-1 mx-2 bg-blue-200 p-10 rounded-lg"
      >
        {/* Full Name */}
        <div>
          <label className="block font-medium font-sans">Full Name</label>
          <input {...register("fullName")} className="border-none bg-white rounded-lg p-2 w-full font-sans" />
          {errors.fullName && (
            <p className="text-red-600 text-sm font-sans mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium font-sans">Email</label>
          <input
            {...register("email")}
            type="email"
            className="border-none bg-white rounded-lg p-2 w-full font-sans"
          />
          {errors.email && (
            <p className="text-red-600 text-sm font-sans mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block font-medium font-sans">Company Name</label>
          <input {...register("companyName")} className="border-none bg-white rounded-lg p-2 w-full font-sans" />
          {errors.companyName && (
            <p className="text-red-600 text-sm font-sans mt-1">{errors.companyName.message}</p>
          )}
        </div>

        {/* Services */}
        <div>
          <label className="block font-medium font-sans">Services Interested In</label>
          {services.map((service) => (
            <label key={service} className="block">
              <input
                type="checkbox"
                value={service}
                {...register("services")}
                checked={selectedServices.includes(service)}
                onChange={(e) => {
                  const current = selectedServices || [];
                  if (e.target.checked) {
                    setValue("services", [...current, service as ServiceType]);
                  } else {
                    setValue(
                      "services",
                      current.filter((s) => s !== service) as ServiceType[]
                    );
                  }
                }}
              />
              <span className="ml-2 font-sans">{service}</span>
            </label>
          ))}
          {errors.services && (
            <p className="text-red-600 text-sm font-sans mt-1">{errors.services.message}</p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="block font-medium font-sans">Budget (USD)</label>
          <input
            {...register("budgetUsd", { valueAsNumber: true })}
            type="number"
            className="border-none bg-white rounded-lg p-2 w-full font-sans"
          />
          {errors.budgetUsd && (
            <p className="text-red-600 text-sm font-sans mt-1">{errors.budgetUsd.message}</p>
          )}
        </div>

        {/* Project Start Date */}
        <div>
          <label className="block font-medium font-sans">Project Start Date</label>
          <input
            {...register("projectStartDate")}
            type="date"
            className="border-none bg-white rounded-lg p-2 w-full font-sans"
          />
          {errors.projectStartDate && (
            <p className="text-red-600 text-sm font-sans mt-1">
              {errors.projectStartDate.message}
            </p>
          )}
        </div>

        {/* Accept Terms */}
        <div>
          <label>
            <input className="font-sans font-bold text-lg" type="checkbox" {...register("acceptTerms")} /> I accept the
            terms
          </label>
          {errors.acceptTerms && (
            <p className="text-red-600 text-sm font-sans mt-1">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg border-2 border-solid bg-black hover:bg-gray-800  py-2 text-white text-base w-48 h-14 mx-auto font-sans font-semibold "
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Right side preview */}
      <div className="flex flex-1 rounded-lg bg-cyan-900 text-white">
        <pre className="m-10 font-semibold font-sans ">{JSON.stringify(data, null, 6)}</pre>
      </div>
    </section>
  );
}
