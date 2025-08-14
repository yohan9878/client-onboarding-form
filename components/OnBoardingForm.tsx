"use client";

import { OnboardFormData, OnboardSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

type Inputs = z.infer<typeof OnboardSchema>

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
})

 useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get("service");
    if (serviceParam && ["UI/UX", "Branding", "Web Dev", "Mobile App"].includes(serviceParam)) {
      setValue("services", [serviceParam]);
    }
  }, [setValue]);

  const onSubmit = async (data: OnboardFormData) => {
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

      setSuccessMsg(`Form submitted successfully! Thank you, ${data.fullName}.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Network error");
    }
  };

  const services = ["UI/UX", "Branding", "Web Dev", "Mobile App"];
  const selectedServices = watch("services");

// const processForm: SubmitHandler<Inputs> = data => {
//     reset()
//     setData(data)
// }

  return (
    <section className="flex gap-6 p-10">

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-2 sm:w-1/2 mx-2 ">
        {/* Full Name */}
        <div>
          <label className="block font-medium">Full Name</label>
          <input {...register("fullName")} className="border p-2 w-full" />
          {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input {...register("email")} type="email" className="border p-2 w-full" />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        {/* Company Name */}
        <div>
          <label className="block font-medium">Company Name</label>
          <input {...register("companyName")} className="border p-2 w-full" />
          {errors.companyName && <p className="text-red-600 text-sm">{errors.companyName.message}</p>}
        </div>

        {/* Services */}
        <div>
          <label className="block font-medium">Services Interested In</label>
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
                    setValue("services", [...current, service]);
                  } else {
                    setValue("services", current.filter((s: string) => s !== service));
                  }
                }}
              />
              <span className="ml-2">{service}</span>
            </label>
          ))}
          {errors.services && <p className="text-red-600 text-sm">{errors.services.message}</p>}
        </div>

        {/* Budget */}
        <div>
          <label className="block font-medium">Budget (USD)</label>
          <input
            {...register("budgetUsd", { valueAsNumber: true })}
            type="number"
            className="border p-2 w-full"
          />
          {errors.budgetUsd && <p className="text-red-600 text-sm">{errors.budgetUsd.message}</p>}
        </div>

        {/* Project Start Date */}
        <div>
          <label className="block font-medium">Project Start Date</label>
          <input {...register("projectStartDate")} type="date" className="border p-2 w-full" />
          {errors.projectStartDate && (
            <p className="text-red-600 text-sm">{errors.projectStartDate.message}</p>
          )}
        </div>

        {/* Accept Terms */}
        <div>
          <label>
            <input type="checkbox" {...register("acceptTerms")} /> I accept the terms
          </label>
          {errors.acceptTerms && (
            <p className="text-red-600 text-sm">{errors.acceptTerms.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg border-2 bg-black py-2 text-white w-24 h-10"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <div className="flex-1 rounded-lg bg-cyan-900 text-white m-2">
        <pre>{JSON.stringify(data, null, 6)}</pre>
      </div>
    </section>
  );
}


