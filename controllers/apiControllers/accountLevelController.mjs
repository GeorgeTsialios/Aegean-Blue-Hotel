import { AccountLevel } from "../../model/accountLevel.mjs";

async function returnAccountLevels(client) {
    return await AccountLevel.queryAccountLevels(client);
}

export { returnAccountLevels }