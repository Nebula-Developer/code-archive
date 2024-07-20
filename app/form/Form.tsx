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
  remedy,
  size
}: {
  price: number;
  remedy: string;
  size: string;
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
      forceReRender={[price, remedy, size]}
      createOrder={async (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: price.toString(),
                currency_code: "NZD",
                breakdown: {
                  item_total: {
                    value: price.toString(),
                    currency_code: "NZD",
                  },
                }
              },
              description: `Anxious Doggy Remedy`,
              soft_descriptor: `Anxious Doggy Remedy`,
              items: [
                {
                  name: `Anxious Doggy Remedy`,
                  description: `Remedy (${size}) for (${remedy})`,
                  unit_amount: {
                    value: price.toString(),
                    currency_code: "NZD",
                  },
                  quantity: "1",
                }
              ],
            },
          ],
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
  positives,
  negatives,
  remedies,
  setRemedies,
}: {
  remedy: string;
  positives: string[];
  negatives: string[];
  remedies: string[];
  setRemedies: any;
}) {
  return (
    <div
      className={`transition-colors duration-75 select-none cursor-pointer min-w-fit flex items-center space-x-2 rounded-md flex-1 p-3 sm:p-4 ${
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
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm sm:text-base">{remedy}</span>
        <span className={(remedies.includes(remedy) ? "text-white" : "text-black") + " text-sm sm:text-base"}>- {negatives.join(", ")}</span>
        <span className={(remedies.includes(remedy) ? "text-green-300" : "text-green-700") + " text-sm sm:text-base"}>+ {positives.join(", ")}</span>
      </div>
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

  const remedyList: {
    [key: string]: {
      negative: string[];
      positive: string[];
    };
  } = {
    "Agrimony": {
      negative: [ "Hides problems behind a cheerful facade", "Internal turmoil" ],
      positive: [ "Inner peace", "Genuine cheerfulness" ],
    },
    "Aspen": {
      negative: [ "Anxiety", "Unexplained fears" ],
      positive: [ "Inner peace", "Fearlessness" ],
    },
    "Beech": {
      negative: [ "Criticism", "Intolerance" ],
      positive: [ "Tolerance", "Understanding" ],
    },
    "Centaury": {
      negative: [ "Weak-willed", "Inability to say no" ],
      positive: [ "Strength of will", "Assertiveness" ],
    },
    "Cerato": {
      negative: [ "Lack of self-confidence", "Seeks advice from others" ],
      positive: [ "Trust in one's own judgement" ],
    },
    "Cherry Plum": {
      negative: [ "Fear of losing control", "Desperation" ],
      positive: [ "Self-control", "Calmness" ],
    },
    "Chestnut Bud": {
      negative: [ "Repeats mistakes", "Failure to learn" ],
      positive: [ "Learning from experiences", "Observant" ],
    },
    "Chicory": {
      negative: [ "Possessive", "Self-pity" ],
      positive: [ "Unconditional love", "Selflessness" ],
    },
    "Clematis": {
      negative: [ "Daydreaming", "Lack of interest in the present" ],
      positive: [ "Focus", "Living in the present" ],
    },
    "Crab Apple": {
      negative: [ "Self-disgust", "Feeling unclean" ],
      positive: [ "Acceptance", "Cleansing" ],
    },
    "Elm": {
      negative: [ "Overwhelmed by responsibilities" ],
      positive: [ "Confidence", "Competence" ],
    },
    "Gentian": {
      negative: [ "Easily discouraged after setbacks" ],
      positive: [ "Perseverance", "Faith" ],
    },
    "Gorse": {
      negative: [ "Hopelessness" ],
      positive: [ "Hope", "Optimism" ],
    },
    "Heather": {
      negative: [ "Self-centered", "Talkative" ],
      positive: [ "Empathy", "Connection with others" ],
    },
    "Holly": {
      negative: [ "Hatred", "Envy", "Jealousy" ],
      positive: [ "Love", "Generosity" ],
    },
    "Honeysuckle": {
      negative: [ "Living in the past", "Nostalgia" ],
      positive: [ "Moving forward", "Embracing the present" ],
    },
    "Hornbeam": {
      negative: [ "Weariness", "Procrastination" ],
      positive: [ "Vitality", "Energy" ],
    },
    "Impatiens": {
      negative: [ "Impatience", "Irritability" ],
      positive: [ "Patience", "Gentleness" ],
    },
    "Larch": {
      negative: [ "Lack of confidence", "Fear of failure" ],
      positive: [ "Confidence", "Self-assurance" ],
    },
    "Mimulus": {
      negative: [ "Known fears", "Shyness" ],
      positive: [ "Courage", "Bravery" ],
    },
    "Mustard": {
      negative: [ "Deep gloom without known reason" ],
      positive: [ "Lightness", "Joy" ],
    },
    "Oak": {
      negative: [ "Overworking despite exhaustion" ],
      positive: [ "Endurance", "Strength" ],
    },
    "Olive": {
      negative: [ "Exhaustion", "Fatigue" ],
      positive: [ "Vitality", "Energy" ],
    },
    "Pine": {
      negative: [ "Guilt", "Self-blame" ],
      positive: [ "Self-acceptance", "Self-forgiveness" ],
    },
    "Red Chestnut": {
      negative: [ "Over-concern for others" ],
      positive: [ "Calm", "Trust in others' abilities" ],
    },
    "Rock Rose": {
      negative: [ "Terror", "Panic" ],
      positive: [ "Courage", "Calm" ],
    },
    "Rock Water": {
      negative: [ "Rigidity", "Self-denial" ],
      positive: [ "Flexibility", "Openness" ],
    },
    "Scleranthus": {
      negative: [ "Indecision", "Imbalance" ],
      positive: [ "Balance", "Certainty" ],
    },
    "Star of Bethlehem": {
      negative: [ "Shock", "Trauma" ],
      positive: [ "Healing", "Comfort" ],
    },
    "Sweet Chestnut": {
      negative: [ "Extreme mental anguish", "Despair" ],
      positive: [ "Liberation", "Inner peace" ],
    },
    "Vervain": {
      negative: [ "Over-enthusiasm", "Stress" ],
      positive: [ "Calm", "Balance" ],
    },
    "Vine": {
      negative: [ "Dominance", "Inflexibility" ],
      positive: [ "Leadership", "Respect for others" ],
    },
    "Walnut": {
      negative: [ "Difficulty adapting to change", "Outside influences" ],
      positive: [ "Adaptability", "Protection" ],
    },
    "Water Violet": {
      negative: [ "Aloofness", "Isolation" ],
      positive: [ "Connection", "Humility" ],
    },
    "White Chestnut": {
      negative: [ "Unwanted thoughts", "Mental arguments" ],
      positive: [ "Clarity", "Peace of mind" ],
    },
    "Wild Oat": {
      negative: [ "Uncertainty about one's path in life" ],
      positive: [ "Purpose", "Direction" ],
    },
    "Wild Rose": {
      negative: [ "Apathy", "Resignation" ],
      positive: [ "Willingness", "Enthusiasm" ],
    },
    "Willow": {
      negative: [ "Resentment", "Self-pity" ],
      positive: [ "Forgiveness", "Acceptance" ],
    },
  };

  return (
    <div className="m-5">
      <div className="flex justify-center">
        <div className="container shadow-lg space-y-4 flex flex-col p-5 bg-white rounded-md">
          <div className="text-2xl md:text-4xl">Create Your Remedy</div>

          <div className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-2">
              <label>Name of Four Leg</label>
              <Input onChange={(e: any) => setName(e.target.value)} />
            </div>

            <div className="flex flex-col space-y-2">
              <label>Birthday of Four Leg</label>
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

                <div className="flex flex-wrap gap-5">
                  {Object.entries(remedyList).map(
                    ([remedy, { positive, negative }]) => (
                      <RemedyCheckbox
                        remedy={remedy}
                        positives={positive}
                        negatives={negative}
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
              <div className="border border-gray-400 rounded-md p-2 flex flex-col space-y-3">
                {remedies.length === 0 && "No remedies selected"}
                {remedies.map((remedy) => (
                  <div key={remedy} className="text-sm sm:text-base">
                    {remedy} <span className="text-xs sm:text-sm text-gray-400">(- {remedyList[remedy].negative.join(", ")} | + {remedyList[remedy].positive.join(", ")})</span>
                  </div>
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
                {remedies.length === 0 ? (
                  <p>Please select at least one remedy to proceed to payment</p>
                ) : dosage === "" ? (
                  <p>Please select the correct dosage to proceed to payment</p>
                ) : (
                  <>
                    <div className="text-2xl">Payment</div>
                    <div className="text-sm mb-12 text-gray-500">Shipping is restricted to New Zealand only.</div>

                    <div className="text-xl mb-5">
                      Total cost (NZD): $
                      {(dosage === "5ml" ? 10 : dosage === "10ml" ? 17 : 75).toFixed(2)}
                    </div>
                    <Paypal
                      price={dosage === "5ml" ? 10 : dosage === "10ml" ? 17 : 75}
                      size={dosage}
                      remedy={remedies.join(", ")}
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
