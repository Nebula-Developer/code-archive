import {NextRequest} from "next/server";
import directus from "../../../lib/directus";
import {cookies} from "next/headers";


export async function POST(req: NextRequest) {
    const error = Response.json({
        success: false
    });

    let json;
    try {
        json = await req.json();
    } catch {
        return error;
    }

    try {
        if (!json.email || !json.password)
            return error;

        var res = await directus.login(json.email, json.password);
        cookies().set("token", JSON.stringify(res));
    } catch {
        return error;
    }

    return Response.json({
        success: true
    });
}