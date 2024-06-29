"use client";

import { PayPalButtons, PayPalMessages, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";
import { useState } from "react";

function Input({ ...props }) {
  return <input className="border border-gray-400 rounded-md p-2" {...props} />;
}

function Paypal({
  price,
  callback,
}: {
  price: number;
  callback: (data: any, actions: any) => void;
}) {
  return (
    <PayPalButtons
      style={{
        color: "silver",
        shape: "pill",
        label: "pay",
        tagline: false,
        layout: "vertical",
        disableMaxWidth: true,
      }}
      className="outline-none border-none w-full max-w-3xl"
      forceReRender={[price]}
      createOrder={async (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: price.toString(),
                currency_code: "NZD",
              },
              shipping: undefined,
              soft_descriptor: "Anxious Doggy Remedy",
              description: "Anxious Doggy Remedy",
            },
          ],
          payment_source: {
            venmo: {
              email_address: "test@test.com",
            },
          },
          intent: "CAPTURE",
        });
      }}
      onApprove={async (data, actions) => callback(data, actions)}
      onError={(err) => {
        console.error(err);
      }}
    />
  );
}

function RemedyCheckbox({
  remedy,
  description,
  remedies,
  setRemedies,
}: {
  remedy: string;
  description: string;
  remedies: string[];
  setRemedies: any;
}) {
  return (
    <div
      className={`transition-colors duration-75 select-none cursor-pointer flex items-center space-x-2 rounded-md w-fit p-2 ${
        remedies.includes(remedy)
          ? "bg-sky-500 text-white"
          : "outline outline-1 outline-gray-400"
      }`}
      onClick={() => {
        if (remedies.includes(remedy)) {
          setRemedies(remedies.filter((r) => r !== remedy));
        } else {
          if (remedies.length < 7) {
            setRemedies([...remedies, remedy]);
          }
        }
      }}
    >
      <p>
        <span className="font-medium">{remedy}</span> -{" "}
        <span
          className={`${
            remedies.includes(remedy) ? "text-gray-200" : "text-gray-500"
          }`}
        >
          {description}
        </span>
      </p>
    </div>
  );
}

export default function Form() {
  return (
    <PayPalScriptProvider
      options={{
        currency: "NZD",
        clientId:
          "AdF7D9WsFhUy5ly6JnYDBy8gOer2NhlFpFJGQUDU8vviTRwcL0hdyz0zJbwcSc1nIyhsINQkHIcNJHD0",
      }}
    >
      <FormContents />
    </PayPalScriptProvider>
  );
}

function FormContents() {
  const [remedies, setRemedies] = useState([]);
  const [dosage, setRawDosage] = useState("5ml");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [description, setDescription] = useState("");
  const [causes, setCauses] = useState("");
  const [duration, setRawDuration] = useState("");

  function setDuration(value: string) {
    setRawDuration(value);
    if (value === "Unsure" || value == "Less than 1 month") {
      setDosage("5ml");
    } else if (value === "1-6 months") {
      setDosage("10ml");
    } else {
      setDosage("50ml");
    }
  }

  function setDosage(value: string) {
    setRawDosage(value);
    localStorage.setItem("dosage", value);
  }

  const remedyDescriptions = {
    Aconite: "Fear, fright, shock, trauma, anxiety, panic",
    "Argentum Nitricum":
      "Anxiety, nervousness, impulsiveness, fear of the unknown",
    "Arsenicum Album": "Anxiety, restlessness, fear, insecurity, perfectionism",
    Belladonna:
      "Fear, aggression, hyperactivity, restlessness, sensitivity to noise",
    Borax: "Fear of thunderstorms, fireworks, sudden noises, travel",
    Bryonia:
      "Fear, aggression, irritability, restlessness, sensitivity to noise",
    "Calcarea Carbonica": "Fear, anxiety, insecurity, shyness, timidity",
    Chamomilla:
      "Fear, aggression, irritability, restlessness, sensitivity to noise",
    Gelsemium: "Fear, anxiety, insecurity, shyness, timidity",
    Ignatia: "Fear, anxiety, insecurity, shyness, timidity",
    Lycopodium: "Fear, anxiety, insecurity, shyness, timidity",
    "Natrum Muriaticum": "Fear, anxiety, insecurity, shyness, timidity",
    "Nux Vomica": "Fear, anxiety, insecurity, shyness, timidity",
    Phosphorus: "Fear, anxiety, insecurity, shyness, timidity",
    Pulsatilla: "Fear, anxiety, insecurity, shyness, timidity",
    "Rhus Tox": "Fear, anxiety, insecurity, shyness, timidity",
    Sepia: "Fear, anxiety, insecurity, shyness, timidity",
    Silicea: "Fear, anxiety, insecurity, shyness, timidity",
    Sulphur: "Fear, anxiety, insecurity, shyness, timidity",
  };

  return (
    <div className="m-5">
      <div className="flex justify-center">
        <div className="container shadow-lg space-y-4 flex flex-col p-5 bg-white rounded-md">
          <div className="text-2xl">Create Your Remedy</div>

          <div className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-2">
              <label>Name of Four Leg</label>
              <Input onChange={(e: any) => setName(e.target.value)} />
            </div>

            <div className="flex flex-col space-y-2">
              <label>Birthday</label>
              <Input
                type="date"
                onChange={(e: any) => setBirthday(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label>Description of Behaviour</label>
              <textarea
                className="border border-gray-400 rounded-md p-2"
                placeholder="Irregular behaviour, aggression, fear, etc."
                onChange={(e: any) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label>Any Known Causes?</label>
              <textarea
                className="border border-gray-400 rounded-md p-2"
                placeholder="Recent move, new family member, etc."
                onChange={(e: any) => setCauses(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label>
                Do you know how long the behaviour has been present?
              </label>
              <select
                className="border border-gray-400 bg-white rounded-md p-2"
                onChange={(e: any) => setDuration(e.target.value)}
              >
                <option>Unsure</option>
                <option>Less than 1 month</option>
                <option>1-6 months</option>
                <option>6-12 months</option>
                <option>1+ years</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <div>
                Now it&apos;s time to choose your remedies.{" "}
                <b>You can choose up to 7 remedies,</b> via either negative or
                positive behaviour. Happy choosing!
              </div>
              <div className="flex flex-col space-y-2">
                <label>({remedies.length}/7)</label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.entries(remedyDescriptions).map(
                    ([remedy, description]) => (
                      <RemedyCheckbox
                        remedy={remedy}
                        description={description}
                        remedies={remedies}
                        setRemedies={setRemedies}
                        key={remedy}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div>Summary of Remedies</div>
              <div className="border border-gray-400 rounded-md p-2">
                {remedies.length === 0 && "No remedies selected"}
                {remedies.map((remedy) => (
                  <div key={remedy}>{remedy}</div>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label>Dosage</label>

              <small>
                {dosage === "5ml"
                  ? "Recommended for less severe cases, or if you are unsure of the duration of the behaviour."
                  : dosage === "10ml"
                  ? "Recommended for cases that have been present for 1-6 months."
                  : dosage === "50ml"
                  ? "Recommended for cases that have been present for 6+ months."
                  : ""}
              </small>

              <select
                className="border border-gray-400 bg-white rounded-md p-2"
                onChange={(e: any) => setDosage(e.target.value)}
                value={dosage}
              >
                <option key="5ml">5ml</option>
                <option key="10ml">10ml</option>
                <option key="50ml">50ml</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="w-full flex flex-col items-center my-10">
                <div className="text-2xl mb-5">Payment</div>
                {remedies.length === 0 ? (
                  <p>Please select at least one remedy to proceed</p>
                ) : dosage === "" ? (
                  <p>Please select the correct dosage to proceed</p>
                ) : (
                  <>
                    <div className="text-xl mb-5">
                      Total cost (NZD): $
                      {(dosage === "5ml" ? 10 : dosage === "10ml" ? 17 : 75).toFixed(2)}
                    </div>
                    <Paypal
                      price={
                        dosage === "5ml" ? 10 : dosage === "10ml" ? 17 : 75
                      }
                      callback={(data, actions) => {
                        console.log(data, actions);

                        actions.order.capture().then((details: any) => {
                          console.log(details);
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
