import { icons } from "../constants/icons";

export default function About() {
  return (
    <>
      <div className="min-h-screen bg-[#030014] w-full">
        <div className="flex-grow min-h-[80vh] flex items-center justify-center">
          <div className="w-[90%] max-w-xl mx-auto">
            <img
              src={icons.logo}
              alt="Logo"
              className="h-24 w-24 m-4 mx-auto"
            />

            <h1 className="text-xl font-bold text-white mb-4">
              About This App
            </h1>

            <p className="text-gray-300 mb-6 text-lg text-justify">
              Welcome to the{" "}
              <span className="font-bold text-white">Au Exam App</span>! This
              app is designed to help students easily access previous year’s
              end-semester question papers in one place.
            </p>

            <h2 className="text-xl font-semibold text-white mb-2">Features:</h2>
            <ul className="text-gray-300 mb-8 space-y-1 list-disc list-inside">
              <li>Create an account and Sign In.</li>
              <li>Browse sample papers easily.</li>
              <li>Access all semesters paper.</li>
              <li>View subjects and their details.</li>
              <li>Add question papers in PDF format.</li>
              <li>Download question papers in PDF format.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2 text-white">
              Why use this app?
            </h2>
            <p className="text-lg text-gray-300 text-justify">
              This app acts as your personal digital library of exam papers. No
              more searching everywhere — just open the app, select your course,
              semester, and subject, and download the papers instantly.
            </p>
          </div>
        </div>
      </div>
      <p className="text-center relative bottom-0 bg-[#030014] left-0 right-0 text-gray-400 text-xs">
        Made for students, free forever
      </p>
    </>
  );
}
