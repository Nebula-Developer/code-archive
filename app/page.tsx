import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div>
        <div className="w-full h-[calc(100vh-5rem)] min-h-32 relative flex items-center justify-center">
          <div className="m-10">
            <div className="text-3xl">Anxious Doggy</div>
            <div className="text-xl">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>
          </div>
        </div>

        <div className="p-5 bg-slate-100 flex items-center justify-center">
          <div className="m-10 max-w-3xl">
            <div className="flex">
              <div className="text-4xl mr-3 font-serif italic">&quot;</div>

              <div>
                I started Anxious Doggy to help our four legs, purely because they deserve our help in this stressful world. And I will tell you this for free, you might not believe in the remedies, however the four legs (and plants) cannot lie, it is in their behavious, the changing and changed behaviour will allow you to see the truth. <i>An unanxious fur baby.</i>
              </div>
            </div>
            <div className="text-xl ml-3 mt-5 font-serif italic">- Kim, <span  className="font-sans text-base">Anxious Doggy</span></div>
          </div>
        </div>
      </div>
    </main>
  );
}
