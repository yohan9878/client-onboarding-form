import OnBoardingForm from "@/components/OnBoardingForm";
import Image from "next/image";
export default function Home() {
  return (
    <>
    <section className="py-24">
      <div className="container">
        <h1 className="flex mx-auto text-2xl font-medium">Client Onboarding Form</h1>
        <OnBoardingForm/>
      </div>
    </section>
    </>
  );
}
