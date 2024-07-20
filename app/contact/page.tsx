export default function Page() {
  return (
    <div className="m-5">
      <div className="flex justify-center">
        <div className="m-5 text-lg flex flex-col justify-center items-center space-y-5">
          <div className="text-3xl mb-5 text-center">Contact</div>
          <div className="container p-10 m-5 bg-slate-400 text-slate-100 rounded-lg">
            <div>
              <div className="flex flex-col space-y-5 sm:text-lg text-sm">
                <p>
                  I am here to help you and your four legged friend. Please
                  don&apos;t hesitate to contact us with any questions or
                  concerns you may have. I will get back to you as soon as
                  possible.
                </p>
                <p>
                  Kim:{" "}
                  <a
                    href="mailto:anxiousdoggy@outlook.com"
                    className="text-sky-300 underline"
                  >
                    anxiousdoggy@outlook.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
