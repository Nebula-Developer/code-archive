import {Page} from "../../lib/pages";
import LoginPanel from "./LoginPanel";

export default Page(() => {
    return (
        <div className="flex justify-center mt-12 sm:mt-20 sm:mx-24">
            <LoginPanel />
        </div>
    );
});
