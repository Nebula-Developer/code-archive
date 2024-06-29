import Image from "next/image";

export default function Page() {
  return (
    <div className="flex justify-center my-10 sm:m-10">
      <div className="text-lg flex flex-col items-center justify-center space-y-5">
        <div className="text-3xl mb-5 text-center">About</div>
        <div
          className="sm:max-w-4xl sm:p-10 p-5 m-2 text-slate-100 rounded-lg shadow-xl shadow-gray-400"
          style={{
            background: "linear-gradient(30deg, rgb(120, 166, 119), #366037)",
          }}
        >
          <div className="sm:text-2xl text-xl mb-3 italic font-light">
            Hi, my name is Kim,
          </div>

          <div className="flex flex-col space-y-5 sm:text-base text-sm">
            <p>
              <Image
                src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                width={500}
                height={300}
                alt="Kim"
                className="sm:float-right object-cover sm:w-1/4 w-full h-32 sm:ml-5 mb-5 min-w-28 rounded-md"
              />
              I am a qualified <i>Clinical Medical Herbalist</i>,{" "}
              <i>Aromatherapist</i>, <i>Reflexologist</i>, <i>Nutritionist</i>,{" "}
              <i>Swedish Massage</i> and <i>Bach flower Practitioner</i>.{" "}
              <span className="font-medium">
                I Need you to know - I love and adore four legged fur babies.
              </span>{" "}
              I have had the honour of sharing my life with several four legs,
              so I know how much they mean to your heart because they have
              filled mine. When I walk my fur baby down the beach, I am often
              greeted by the neighbourhood dogs, they seriously come running to
              me (no treats - no fake pocket love here) their owners know when
              I&apos;m at the beach, because they just come find me, cover me in
              kisses, telepathic moments and great joy of course.
            </p>

            <p>
              <Image
                src="https://cdn.mos.cms.futurecdn.net/ASHH5bDmsp6wnK6mEfZdcU.jpg"
                width={500}
                height={300}
                alt="Kim"
                className="sm:float-left object-cover sm:w-72 w-full sm:h-52 h-40 sm:mr-5 mb-1 rounded-md"
              />
              Ive got several neighbourhood numbers because their four legs
              decide to visit with me at my house whenever they choose, which of
              course I find charming and honoured, the two legs not so much.
              Post covid lockdowns, walking within my community, I noticed
              anxiety growing within the four legged community, they were used
              to their two legs being home all day, and now, the two legs are
              absent (work) and the four legs get all woried and anxious,
              seperation anxiety, mis behaviour increasing. So naturally I have
              Over the past couple of years I have been dispensing remedies to
              my neghbourhood gang, and noticed an often repeated sentence to me
              by the two legs -{" "}
              <span className="font-medium">
                &quot;should start a business&quot; &quot;this is amazing&quot;
                &quot;you could help so many&quot;
              </span>
              , etc, etc. so here I am being brave and creating an easily
              accessible system for you to personalise your four legs remedy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
