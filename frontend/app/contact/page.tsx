import { Page } from "../lib/pages";

export default Page(() => {
  const contacts = [
    {
      name: "Nico Cook",
      role: "Developer",
      email: "nebuladev.contact@gmail.com",
    },
    {
      name: "John Doe",
      role: "Administrator",
      email: "eg@eg.com",
    },
    {
      name: "Jane Doe",
      role: "Administrator",
      email: "eg@eg.com",
    },
    {
      name: "A",
      role: "Long Content Test Long Content Test Long Content Test ",
      email: "eg@eg.com",
    },
    {
      name: "B",
      role: "Administrator",
      email: "eg@eg.com",
    },
    {
      name: "C",
      role: "Administrator",
      email: "eg@eg.com",
    },
    {
      name: "D",
      role: "Administrator",
      email: "eg@eg.com",
    },
  ];

  return (
    <div>
      <div className="px-4 sm:px-16 lg:px-32 pb-32 mt-12 sm:mt-0">
        <h1 className="text-2xl sm:text-4xl  text-center">
          Email Contacts
        </h1>
        <div className="flex items-center w-full flex-col mt-5 sm:mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contacts.map((contact) => (
              <div
                className="min-w-fit flex flex-col items-center p-5 border border-gray-200 rounded-lg shadow-lg"
                key={contact.email}
              >
                <h2 className="text-2xl ">{contact.name}</h2>
                <p className="text-sm ">{contact.role}</p>
                <p className="text-sm ">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sky-500 underline"
                  >
                    {contact.email}
                  </a>
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-xs text-gray-500 mx-12 sm:mx-0">
            If you would like to contact us regarding content or issues on the
            page, please send an email to:{" "}
            <a
              href="mailto:nebuladev.contact@gmail.com"
              className="text-sky-500 underline"
            >
              nebuladev.contact@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="flex justify-center m-4 sm:m-16 md:m-32">
        <div className="container border border-gray-200 rounded-lg p-12 bg-gray-100 shadow-xl">
          <h1 className="text-2xl sm:text-4xl  text-center">
            Contact Form
          </h1>
          <div className="text-center mt-2 sm:mt-5 text-sm sm:text-base">
            Please fill out the form below to contact one of our administrators.
          </div>

          <div className="flex flex-col gap-2 sm:gap-5 mt-12">
            <div className="flex w-full gap-2 sm:gap-5 flex-wrap">
              <input
                type="text"
                placeholder="Name"
                className="p-3 border border-gray-200 rounded-lg flex-1 min-w-full text-xs sm:text-base"
              />
              <input
                type="email"
                placeholder="Email"
                className="p-3 border border-gray-200 rounded-lg flex-1 min-w-full text-xs sm:text-base"
              />
            </div>
            <textarea
              placeholder="Message"
              className="p-3 border border-gray-200 rounded-lg h-56 text-xs sm:text-base"
            />
            <button className="p-2 sm:p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
