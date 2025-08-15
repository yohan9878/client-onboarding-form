import OnBoardingForm from "@/components/OnBoardingForm";
import Image from "next/image";
export default function Home() {
  return (
    <>
    <section className="py-6">
      <div className="container bg- mx-auto rounded-xl">
        <h1 className="pt-10 text-center text-4xl font-semibold font-sans text-grey-800">Client Onboarding Form</h1>
        <OnBoardingForm/>
      </div>
    </section>
    </>
  );
}
